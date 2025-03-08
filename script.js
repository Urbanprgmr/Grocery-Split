// Data Storage
let items = JSON.parse(localStorage.getItem('items')) || [];
let members = JSON.parse(localStorage.getItem('members')) || [];
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// DOM Elements
const addItemForm = document.getElementById('add-item-form');
const addMemberForm = document.getElementById('add-member-form');
const assignItemForm = document.getElementById('assign-item-form');
const groceryList = document.getElementById('grocery-list').querySelector('tbody');
const membersList = document.getElementById('members-list').querySelector('tbody');
const assignItemSelect = document.getElementById('assign-item');
const assignMemberSelect = document.getElementById('assign-member');
const assignedItemsContainer = document.getElementById('assigned-items');

// Helper function to format currency as MVR
function formatCurrency(amount) {
  return `MVR ${amount.toFixed(2)}`;
}

// Helper function to calculate remaining quantity
function getRemainingQuantity(itemName) {
  const totalAssigned = assignments
    .filter(a => a.item === itemName)
    .reduce((sum, a) => sum + a.quantity, 0);
  const item = items.find(i => i.name === itemName);
  return item ? item.quantity - totalAssigned : 0;
}

// Render Items with Remaining Quantity
function renderItems() {
  groceryList.innerHTML = items.map((item, index) => {
    const remainingQuantity = getRemainingQuantity(item.name);
    return `
      <tr>
        <td>${item.name}</td>
        <td>${formatCurrency(item.price)}</td>
        <td>${item.quantity}</td>
        <td>${remainingQuantity}</td>
        <td>
          <button onclick="editItem(${index})">Edit</button>
          <button onclick="deleteItem(${index})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Render Members
function renderMembers() {
  membersList.innerHTML = members.map((member, index) => {
    const total = assignments
      .filter(a => a.member === member.name)
      .reduce((sum, a) => sum + (a.quantity * items.find(i => i.name === a.item).price), 0);
    return `
      <tr>
        <td>${member.name}</td>
        <td>${formatCurrency(total)}</td>
        <td>
          <button onclick="editMember(${index})">Edit</button>
          <button onclick="deleteMember(${index})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Render Assigned Items
function renderAssignedItems() {
  assignedItemsContainer.innerHTML = members.map(member => {
    const memberAssignments = assignments.filter(a => a.member === member.name);
    if (memberAssignments.length === 0) return '';

    const itemsList = memberAssignments.map(a => {
      const item = items.find(i => i.name === a.item);
      const totalCost = item.price * a.quantity;
      return `
        <div class="assigned-item">
          <span>${a.item} (${a.quantity}x)</span>
          <span>${formatCurrency(totalCost)}</span>
        </div>
      `;
    }).join('');

    const total = memberAssignments.reduce((sum, a) => {
      const item = items.find(i => i.name === a.item);
      return sum + (item.price * a.quantity);
    }, 0);

    return `
      <div class="member-assignments">
        <h3>${member.name}</h3>
        ${itemsList}
        <div class="assigned-item total">
          <span><strong>Total</strong></span>
          <span><strong>${formatCurrency(total)}</strong></span>
        </div>
      </div>
    `;
  }).join('');
}

// Render Assign Options
function renderAssignOptions() {
  assignItemSelect.innerHTML = '<option value="">Select Item</option>' + items.map(item => `
    <option value="${item.name}">${item.name}</option>
  `).join('');

  assignMemberSelect.innerHTML = '<option value="">Select Member</option>' + members.map(member => `
    <option value="${member.name}">${member.name}</option>
  `).join('');
}

// Add Item
addItemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('item-name').value;
  const price = parseFloat(document.getElementById('item-price').value);
  const quantity = parseInt(document.getElementById('item-quantity').value);
  items.push({ name, price, quantity });
  localStorage.setItem('items', JSON.stringify(items));
  initialize();
  addItemForm.reset();
});

// Add Member
addMemberForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('member-name').value;
  members.push({ name });
  localStorage.setItem('members', JSON.stringify(members));
  initialize();
  addMemberForm.reset();
});

// Assign Item
assignItemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const item = assignItemSelect.value;
  const member = assignMemberSelect.value;
  const quantity = parseInt(document.getElementById('assign-quantity').value);
  assignments.push({ item, member, quantity });
  localStorage.setItem('assignments', JSON.stringify(assignments));
  initialize();
  assignItemForm.reset();
});

// Edit Item
function editItem(index) {
  const item = items[index];
  const newName = prompt('Enter new item name:', item.name);
  const newPrice = parseFloat(prompt('Enter new item price:', item.price));
  const newQuantity = parseInt(prompt('Enter new item quantity:', item.quantity));
  if (newName && !isNaN(newPrice) && !isNaN(newQuantity)) {
    items[index] = { name: newName, price: newPrice, quantity: newQuantity };
    localStorage.setItem('items', JSON.stringify(items));
    initialize();
  }
}

// Delete Item
function deleteItem(index) {
  if (confirm('Are you sure you want to delete this item?')) {
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    initialize();
  }
}

// Edit Member
function editMember(index) {
  const member = members[index];
  const newName = prompt('Enter new member name:', member.name);
  if (newName) {
    members[index] = { name: newName };
    localStorage.setItem('members', JSON.stringify(members));
    initialize();
  }
}

// Delete Member
function deleteMember(index) {
  if (confirm('Are you sure you want to delete this member?')) {
    members.splice(index, 1);
    localStorage.setItem('members', JSON.stringify(members));
    initialize();
  }
}

// Initialize App
function initialize() {
  renderItems();
  renderMembers();
  renderAssignOptions();
  renderAssignedItems();
}

initialize();
