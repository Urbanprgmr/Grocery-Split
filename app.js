document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addItemForm');
  const tableBody = document.querySelector('#itemsTable tbody');
  const summaryDiv = document.getElementById('summary');

  // Participants in the split (example names)
  const participants = ['Alice', 'Bob'];
  const items = [];  // to store added items

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get form values
    const itemName = document.getElementById('itemName').value.trim();
    const price = parseFloat(document.getElementById('itemPrice').value);
    const paidBy = document.getElementById('paidBy').value;
    if (!itemName || isNaN(price)) return;  // simple validation

    // Add new item to the list
    const newItem = { name: itemName, price: price, paidBy: paidBy };
    items.push(newItem);

    // Append a new row to the items table
    const row = document.createElement('tr');
    let cells = `
      <td>${newItem.name}</td>
      <td>$${newItem.price.toFixed(2)}</td>
      <td>${newItem.paidBy}</td>`;
    // Calculate equal share for each participant (for display purposes)
    const share = newItem.price / participants.length;
    participants.forEach(person => {
      cells += `<td>$${share.toFixed(2)}</td>`;
    });
    row.innerHTML = cells;
    tableBody.appendChild(row);

    // Recalculate summary totals for each participant
    const totals = {};
    participants.forEach(person => totals[person] = 0);
    items.forEach(item => {
      const share = item.price / participants.length;
      participants.forEach(person => {
        if (person === item.paidBy) {
          // Payer covers the whole item, so deduct others' shares from their total
          totals[person] -= share * (participants.length - 1);
        } else {
          // Non-payer owes their share
          totals[person] += share;
        }
      });
    });

    // Display the updated summary in a list format
    let summaryHTML = "<h3>Summary</h3><ul>";
    participants.forEach(person => {
      if (totals[person] < 0) {
        // Negative total means this person paid more than their share (others owe them)
        summaryHTML += `<li>${person} should receive $${Math.abs(totals[person]).toFixed(2)}</li>`;
      } else if (totals[person] > 0) {
        // Positive total means this person owes money to others
        summaryHTML += `<li>${person} owes $${totals[person].toFixed(2)}</li>`;
      } else {
        summaryHTML += `<li>${person} is settled up</li>`;
      }
    });
    summaryHTML += "</ul>";
    summaryDiv.innerHTML = summaryHTML;

    // Reset the form fields for the next entry
    form.reset();
  });
});
