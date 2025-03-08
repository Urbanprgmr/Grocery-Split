let items = JSON.parse(localStorage.getItem("smartGroceryItems")) || [];
let members = JSON.parse(localStorage.getItem("smartGroceryMembers")) || [];
let payments = JSON.parse(localStorage.getItem("smartGroceryPayments")) || {};

function saveData() {
    localStorage.setItem("smartGroceryItems", JSON.stringify(items));
    localStorage.setItem("smartGroceryMembers", JSON.stringify(members));
    localStorage.setItem("smartGroceryPayments", JSON.stringify(payments));
}

function addItem() {
    let name = document.getElementById("itemName").value.trim();
    let quantity = parseInt(document.getElementById("itemQuantity").value);
    let price = parseFloat(document.getElementById("itemPrice").value);

    if (!name || isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
        alert("Enter valid item details");
        return;
    }

    items.push({ name, quantity, price, remaining: quantity });
    saveData();
    updateItemsTable();
    updateItemDropdown();

    document.getElementById("itemName").value = "";
    document.getElementById("itemQuantity").value = "";
    document.getElementById("itemPrice").value = "";
}

function updateItemsTable() {
    let tbody = document.querySelector("#itemsTable tbody");
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        let row = tbody.insertRow();
        row.innerHTML = `<td>${item.name}</td><td>${item.quantity}</td><td>MVR ${item.price.toFixed(2)}</td>
                         <td>MVR ${(item.quantity * item.price).toFixed(2)}</td>
                         <td><button onclick="deleteItem(${index})">Delete</button></td>`;
    });
}

function deleteItem(index) {
    items.splice(index, 1);
    saveData();
    updateItemsTable();
    updateItemDropdown();
}

function updateItemDropdown() {
    let select = document.getElementById("selectItem");
    select.innerHTML = "";
    items.forEach(item => {
        let option = document.createElement("option");
        option.value = item.name;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

// Initialize Data on Load
updateItemsTable();
updateItemDropdown();
