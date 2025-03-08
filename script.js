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

// Render Functions
function renderItems() {
  groceryList.innerHTML = items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
    </tr>
  `).join('');
}

function renderMembers() {
  membersList.innerHTML = members.map(member => {
    const total = assignments
      .filter(a => a.member === member.name)
      .reduce((sum, a) => sum + (a.quantity * items.find(i => i.name === a.item).price), 0);
    return `
      <tr>
        <td>${member.name}</td>
        <td>$${total.toFixed(2)}</td>
      </tr>
    `;
  }).join('');
}

function renderAssignOptions() {
  assignItemSelect.innerHTML = '<option value="">Select Item</option>' + items.map(item => `
    <option value="${item.name}">${item.name}</option>
  `).join('');

  assignMemberSelect.innerHTML = '<option value="">Select Member</option>' + members.map(member => `
    <option value="${member.name}">${member.name}</option>
  `).join('');
}

// Event Listeners
addItemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('item-name').value;
  const price = parseFloat(document.getElementById('item-price').value);
  const quantity = parseInt(document.getElementById('item-quantity').value);
  items.push({ name, price, quantity });
  localStorage.setItem('items', JSON.stringify(items));
  renderItems();
  renderAssignOptions();
  addItemForm.reset();
});

addMemberForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('member-name').value;
  members.push({ name });
  localStorage.setItem('members', JSON.stringify(members));
  renderMembers();
  renderAssignOptions();
  addMemberForm.reset();
});

assignItemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const item = assignItemSelect.value;
  const member = assignMemberSelect.value;
  const quantity = parseInt(document.getElementById('assign-quantity').value);
  assignments.push({ item, member, quantity });
  localStorage.setItem('assignments', JSON.stringify(assignments));
  renderMembers();
  assignItemForm.reset();
});

// Initial Render
renderItems();
renderMembers();
renderAssignOptions();
