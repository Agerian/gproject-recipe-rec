const searchBtn = document.querySelector('#searchButton');
const searchRec = document.querySelector('#recipeSearch');

// Function to fetch recipe information based on recipe ID
const apiNinjas = '34OI8Z++sC2o2ypun3q94w==IYDU5y8iMC0HEDlA';
const apiOptions = {
  method: 'GET',
  headers: {'x-api-key' : '34OI8Z++sC2o2ypun3q94w==IYDU5y8iMC0HEDlA'}
}

searchRecipiesAPI = function(){
  const searchInput = searchRec.value;
  console.log(searchInput);
  const apiNinjasRecURL =`https://api.api-ninjas.com/v1/recipe?query=${searchInput}`;

  fetch(apiNinjasRecURL, apiOptions)
  .then(function(response){
    return response.json();
  })
  .then(function(data) {
    console.log(data);
  })
}


searchBtn.addEventListener('click', searchRecipiesAPI)