const appId = 'dc36a5f3';
const appKey = 'f80e9e792751861c2b58f13cb2113115';

const searchInput = document.getElementById('recipeSearch');
const searchButton = document.getElementById('searchButtonRecipes');
const recipeList = document.getElementById('recipeList');

searchButton.addEventListener('click', searchRecipes);

function searchRecipes(event) {
    event.preventDefault();

    // Log the entire event object to console
    console.log(event);

    const searchTerm = searchInput.value;
    if(searchTerm) {
        const apiEndpoint = `https://api.edamam.com/search?q=${searchTerm}&app_id=${appId}&app_key=${appKey}`;

        // Network request to URL. Fetch function returns a Promise that resolves to the response
        fetch(apiEndpoint)
            .then(function (response) {
                return response.json(); //Fetch complete, json.parse() the response
            })
            .then(function (data) {
                console.log(data);
                console.log(data.hits);
                displayRecipes(data.hits); // Parse() complete, call function with 'data.hits' as argument
            })
            .catch(function (goof) {
                console.error('Fetch error:', goof);
            })
    }
}

// Function creates 'recipeCard' s for each 'hit'
function displayRecipes(recipes) {
    recipeList.innerHTML = '';
    recipes.forEach((recipe, index) => { // Iterates over each element in 'recipes' array
        const recipeCard = createRecipeCard(recipe, index); // Call function inside loop. For EACH recipe
        recipeList.appendChild(recipeCard);
        document.querySelector('.result-cards').style.display = 'flex';
    });
}

function createRecipeCard(recipe, index) {
    const recipeCard = document.createElement('div'); // Element to represent recipe card
    recipeCard.classList.add('recipeCard');
    
    // Template literal (String Interpolation) allows for dynamic insertion based on properties of the 'recipe' object
    recipeCard.innerHTML = `
    <div class="recipeTop">
            <div class="recipe-image">
                <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            </div>
            <div class="recipe-details">
                <h3>${recipe.recipe.label}</h3>
                <div class="recipe-cautions">${recipe.recipe.cautions}</div>
                <a href="${recipe.recipe.url}" class="view-details">View Details</a>
                <button class="save-button" onclick="saveRecipe(${index})">Save</button>
            </div>
        </div>
        <div class="recipeBottom">
            <ul class="recipe-ingredients">
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
    `; // Transform the ingredientLines array into a string of HTML list items, and this string is then inserted into the HTML content of the ul element with the class recipe-ingredients. Each ingredient becomes a list item in an unordered list.
    return recipeCard;
}

// API for Drink Recipes
const drinkInput = document.querySelector('#drinkSearch');
const drinkSearchButton = document.querySelector('#searchButtonDrinks');
const apiNinjas = '34OI8Z++sC2o2ypun3q94w==IYDU5y8iMC0HEDlA';
const drinkForm = document.querySelector('#drinkForm');
const apiOptions = {
    method: 'GET',
    headers: { 'x-api-key': '34OI8Z++sC2o2ypun3q94w==IYDU5y8iMC0HEDlA' }
}

drinkForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchDrinksAPI();
});


function searchDrinksAPI() {
    const drinkSearchInput = drinkInput.value;
    const apiNinjasRecURL = `https://api.api-ninjas.com/v1/cocktail?name=${drinkSearchInput}`;

    fetch(apiNinjasRecURL, apiOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (Array.isArray(data) && data.length > 0) {
                displayDrinksRecipes(data);
            } else {
                console.log('No data found for the given input.');
            }
        })
}

// Display Drink Recipes
const drinkList = document.getElementById('drinkList');

function displayDrinksRecipes(drinks) {
    drinkList.innerHTML = '';
    drinks.forEach((drink, index) => {
        const drinkCard = createDrinkCard(drink);
        drinkList.appendChild(drinkCard);
        document.querySelector('.result-cards').style.display = 'flex';
    });
}

function createDrinkCard(drink) {
    const drinkCard = document.createElement('div');
    drinkCard.classList.add('drinkCard');
    drinkCard.innerHTML = `
        <div class="drinkTop">
            <div class='drink-emoji'></div>
            <div class='drink-details'>
                <h3>${drink.name}</h3>
            </div>
        </div>
        <div class="drinkMiddle"> 
            <ul class="ingredients-list list-style-type-none">
                ${drink.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
        <div class="drinkBottom">
            <p>${drink.instructions}</p>
        </div>
    `;
    return drinkCard;
}

// Save Recipe
function saveRecipe(index) {
    // Retrieve saved recipes from local stroage, convert from string to array. Or create an empty array
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

    // Add HTML conctent of the SELECTED recipe to the saved recipes array. index of recipe in 'recipeList'
    savedRecipes.push(recipeList.children[index].innerHTML);

    // Save the updated array back to local stroage, array to string
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));

    // Remove the save button from the displayed recipe
    const savedRecipeCard = recipeList.children[index];
    const saveButton = savedRecipeCard.querySelector('.save-button');
    if (saveButton) {
        saveButton.remove();
    }

    // Display alert
    alert('Recipe saved!');
}

// Function to open the modal
function openModal() {
    // Get recipe history list element
    const recipeHistoryList = document.getElementById('recipeHistoryList');
    recipeHistoryList.innerHTML = '';

    // Fetch saved recipes from local storage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

    // Populate the modal with the saved recipes
    savedRecipes.forEach(function(savedRecipe, index) {
        const listItem = document.createElement('li');
        listItem.innerHTML = savedRecipe;

        // Create a "Delete" button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteRecipe(index);

        // Append the "Delete" button to the list item
        listItem.appendChild(deleteButton);

        recipeHistoryList.appendChild(listItem);
    });

    // Display Modal
    document.getElementById('recipeModal').style.display = 'block';

    // After the modal is displayed, remove the "Save" buttons
    removeSaveButtons();
}

// Function to remove "Save" buttons from each recipe in the modal
function removeSaveButtons() {
    const saveButtons = document.querySelectorAll('.save-button');
    saveButtons.forEach((button) => button.remove());
}

// Function to close the modal
function closeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

// Function to delete a recipe
function deleteRecipe(index) {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

    // Remove the recipe at the specified index
    savedRecipes.splice(index, 1);

    // Update local storage
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));

    // Refresh the modal content
    openModal();
}