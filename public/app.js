
const API_URL = 'http://localhost:5000/api/persons';

// Function to fetch all persons
async function fetchPersons() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch persons');
    const data = await response.json();

    const personsList = document.getElementById('persons');
    personsList.innerHTML = ''; // Clear previous data

    data.forEach((person) => {
      const listItem = document.createElement('li');
      listItem.classList.add(
        'p-4',
        'border',
        'rounded',
        'bg-gray-100',
        'shadow-sm',
        'flex',
        'justify-between',
        'items-center'
      );

      listItem.innerHTML = `
        <div>
          <p><strong>Name:</strong> ${person.name}</p>
          <p><strong>Age:</strong> ${person.age}</p>
          <p><strong>Favorite Foods:</strong> ${person.favoriteFoods.join(', ')}</p>
        </div>
        <button 
          class="delete-btn px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700" 
          data-id="${person._id}">
          Delete
        </button>
      `;
      personsList.appendChild(listItem);
    });

    // Add delete button event listeners
    document.querySelectorAll('.delete-btn').forEach((button) => {
      button.addEventListener('click', async (e) => {
        const personId = e.target.getAttribute('data-id');
        await deletePerson(personId);
        fetchPersons(); // Refresh list
      });
    });
  } catch (error) {
    console.error(error);
    document.getElementById('result').innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
  }
}

// Function to delete a person by ID
async function deletePerson(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete person');
    document.getElementById('result').innerHTML = `<p class="text-green-600">Person deleted successfully!</p>`;
  } catch (error) {
    console.error(error);
    document.getElementById('result').innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
  }
}

// Handle form submission
document.getElementById('personForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value.trim();
  const foods = document.getElementById('foods').value.trim();

  if (!name || !age || !foods) {
    document.getElementById('result').innerHTML = `<p class="text-red-600">Please fill all fields.</p>`;
    return;
  }

  const person = { name, age: parseInt(age, 10), favoriteFoods: foods.split(',') };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    });

    if (response.ok) {
      fetchPersons(); // Refresh the persons list after adding a new person
      document.getElementById('result').innerHTML = `<p class="text-green-600">Person added successfully!</p>`;
      document.getElementById('personForm').reset(); // Clear the form
    } else {
      throw new Error('Failed to add person');
    }
  } catch (error) {
    console.error(error);
    document.getElementById('result').innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
  }
});

// Fetch all persons on page load
window.addEventListener('DOMContentLoaded', fetchPersons);
