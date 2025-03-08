document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addItemForm');
    const tableBody = document.querySelector('#itemsTable tbody');
    const summaryDiv = document.getElementById('summary');

    // Participants in the split (example names)
    const participants = ['Alice', 'Bob'];
    const items = JSON.parse(localStorage.getItem("smartGroceryItems")) || [];

    // Function to save items to local storage
    function saveData() {
        localStorage.setItem("smartGroceryItems", JSON.stringify(items));
    }

    // Function to update the table display
    function updateTable() {
        tableBody.innerHTML = ""; // Clear existing table rows
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            let cells = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.paidBy}</td>`;

            const share = item.price / participants.length;
            participants.forEach(person => {
                cells += `<td>$${share.toFixed(2)}</td>`;
            });

            // Add Delete button for each row
            cells += `<td><button onclick="deleteItem(${index})">Delete</button></td>`;
            row.innerHTML = cells;
            tableBody.appendChild(row);
        });
        updateSummary();
    }

    // Function to delete an item
    window.deleteItem = function(index) {
        items.splice(index, 1); // Remove item from array
        saveData(); // Save updated data to local storage
        updateTable(); // Refresh the table display
    }

    // Function to update summary of who owes what
    function updateSummary() {
        const totals = {};
        participants.forEach(person => totals[person] = 0);
        
        items.forEach(item => {
            const share = item.price / participants.length;
            participants.forEach(person => {
                if (person === item.paidBy) {
                    totals[person] -= share * (participants.length - 1);
                } else {
                    totals[person] += share;
                }
            });
        });

        let summaryHTML = "<h3>Summary</h3><ul>";
        participants.forEach(person => {
            if (totals[person] < 0) {
                summaryHTML += `<li>${person} should receive $${Math.abs(totals[person]).toFixed(2)}</li>`;
            } else if (totals[person] > 0) {
                summaryHTML += `<li>${person} owes $${totals[person].toFixed(2)}</li>`;
            } else {
                summaryHTML += `<li>${person} is settled up</li>`;
            }
        });
        summaryHTML += "</ul>";
        summaryDiv.innerHTML = summaryHTML;
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const itemName = document.getElementById('itemName').value.trim();
        const price = parseFloat(document.getElementById('itemPrice').value);
        const paidBy = document.getElementById('paidBy').value;

        if (!itemName || isNaN(price)) {
            alert("Please enter valid item details.");
            return;
        }

        // Add new item to list
        const newItem = { name: itemName, price: price, paidBy: paidBy };
        items.push(newItem);

        saveData(); // Save to local storage
        updateTable(); // Refresh the table

        // Reset form
        form.reset();
    });

    // Initialize table on page load
    updateTable();
});
