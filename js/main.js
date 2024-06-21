// =============== My var ==================

const query = document.querySelector("#gifToSearch");
const nbr = document.querySelector("select");
const wrapper = document.querySelector(".recipe_result");
const button = document.querySelector("#button");
const add = document.querySelector("#add_ingredient");
const second_stage = document.querySelector(".second-stage");
const saved_recipes = document.querySelector(".saved_recipes");
const single_image = document.querySelector(".single-image");

let xValues = ["protein", "fat", "carbohydrates"];
let yValues = [20, 30, 50];
let barColors = ["orange", "green", "blue"];

// =============== My tabs ==================

let ingredients = [];
let savedRecipes = [];

//============== Functions =================

// Pour épingler les ingrédients choisis dans la barre de recherche
function printSingleIngredient(tab) {
  second_stage.innerHTML = "";

  tab.forEach((tabElement, index) => {
    second_stage.innerHTML += `
  <div class="single-ingredient" data-index="${index}"><i class="fa-regular fa-circle-xmark delete" style="cursor:pointer"></i> ${tabElement}</div>
  `;
  });
}

// Pour assembler les ingrédients et les retourner sous forme d'une chaîne de caractère adaptée au fetch
function assembleIngredients(ingredients) {
  // Si le tableau est vide, retournez une chaîne vide
  if (ingredients.length === 0) {
    return (parsedIngredients = "");
  } else if (ingredients.length === 1) {
    // Si un seul ingrédient, retournez l'ingrédient entre guillemets
    parsedIngredients = `"${ingredients[0]}"`;
    return parsedIngredients;
  } else {
    // Sinon, assemblez les ingrédients avec des virgules et des espaces,
    // puis remplacez les virgules par des "+"
    parsedIngredients = ingredients.join(",+");
    return parsedIngredients;
  }
}

function deleteIngredient(lineToKill) {
  ingredients.splice(lineToKill, 1);
  printSingleIngredient(ingredients);
}

function printSavedRecipes(tab) {
  saved_recipes.innerHTML = "";

  if (tab.length !== 0) {
    tab.forEach((oneRecipe, index) => {
      console.log(oneRecipe);
      saved_recipes.innerHTML += `<div class='image title' id=${oneRecipe.id} style="background: url(${oneRecipe.image}) center/cover" onerror="this.style.backgroundImage = 'url(../img/pexels-karolina-grabowska-4033639.jpg)'"><h3 class="title" id=${oneRecipe.id}>${oneRecipe.title}</h3><div class="erase_div"><i class="fa-regular fa-circle-xmark erase" data-index='${index}'></i></div></div>`;
    });
  } else {
    savedRecipes.innerHTML = `<p>no recipe saved</p>`;
  }
}

function deleteSavedRecipe(lineToKill, tab) {
  tab.splice(lineToKill, 1);
  printSavedRecipes(tab);
}

async function generate() {
  // Mettre le wrapper à vide
  wrapper.innerHTML = "";
  let number;
  if (ingredients === "") {
    parsedIngredients = "tomato";
    number = 1;
  } else {
    parsedIngredients = assembleIngredients(ingredients);
    console.log(parsedIngredients);
    number = nbr.value;
  }

  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?includeIngredients=${parsedIngredients}&addRecipeInstructions=true&instructionsRequired=true&number=${number}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "1a2bd81babmsh83f60e5688664e8p194a55jsn3f4dfe85a532",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    const data = JSON.parse(result);
    console.log(data);
    /*data.results.forEach((oneResult) => {
      id_s.push(oneResult.id);
    });
    console.log(id_s);*/
    data.results.forEach(function (oneResult) {
      console.log(oneResult.id);
      // On s'assure que la 1ère lettre de chaque titre soit en majuscule
      const recipeTitle =
        oneResult.title.charAt(0).toUpperCase() + oneResult.title.slice(1);
      console.log(recipeTitle);
      wrapper.innerHTML += `<div class='image title' id=${oneResult.id} data-aos="fade-up-left" style="background: url(${oneResult.image}) center/cover" onerror="this.style.backgroundImage = 'url(../img/pexels-karolina-grabowska-4033639.jpg)'"><h3 data-aos="fade-left" class="title" id=${oneResult.id}>${recipeTitle}</h3><div class="heart"><i class="fa-regular fa-heart" id="multi"></i></div></div>`;
    });
    /*const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${oneResult.id}/information?includeNutrition=true`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "1a2bd81babmsh83f60e5688664e8p194a55jsn3f4dfe85a532",
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        },
      };
      try {
        const response = await fetch(url, options);
        const result = await response.text();
        const data = JSON.parse(result);
        console.log(data);
      } catch (error) {
        console.error(error);
      }*/
  } catch (error) {
    console.error(error);
  }
}

//=============================== EVENTS============================

query.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("add_ingredient").click();
  }
});

wrapper.addEventListener("click", function (event) {
  if (event.target.classList.contains("previous")) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("button").click();
  }
});

button.addEventListener("click", function () {
  generate();
  window.scrollTo(0, 0);
});

add.addEventListener("click", function () {
  if (query.value !== "") {
    let newIngredient = query.value;
    ingredients.push(newIngredient);
    console.log(ingredients);
  }
  printSingleIngredient(ingredients);
  query.value = "";
});

saved_recipes.addEventListener("click", function (e) {
  if (e.target.classList.contains("erase")) {
    let placeInTab = parseInt(e.target.getAttribute("data-index"));
    deleteSavedRecipe(placeInTab, savedRecipes);
  }
});

document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("title")) {
    wrapper.innerHTML = "";
    window.scrollTo(0, 0);
    const idFromA = e.target.id;
    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${idFromA}/information?includeNutrition=true`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "1a2bd81babmsh83f60e5688664e8p194a55jsn3f4dfe85a532",
        "x-rapidapi-host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      },
    };
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const data = JSON.parse(result);
      console.log(data);

      wrapper.innerHTML += `<div class="previous" style="cursor:pointer">< Back</div><h4><a href="${data.sourceUrl}">${data.title}</a></h4>`;
      // Ajoute une classe parente qui contiendra la div image et la div recipe
      const parentDiv = document.createElement("div");
      parentDiv.className = "image-ingredients";

      // Crée la div pour l'image / onerror= permet le lien vers l'image ne fonctionne pas, d'afficher une image par défaut
      const imageDiv = document.createElement("div");
      imageDiv.className = "single-image";
      imageDiv.id = data.id;
      imageDiv.innerHTML = `<img src="${data.image}" onerror="this.src='../img/pexels-karolina-grabowska-4033639.jpg'" alt="photo recette"><div class="heart" style="cursor:pointer"><i class="fa-regular fa-heart" id="single"></i></div>`;

      // Crée une div pour les ingrédients
      const ingredientsDiv = document.createElement("ul");
      ingredientsDiv.className = "ingredients";

      // Crée une sous-div pour les labels
      const labelDiv = document.createElement("div");
      labelDiv.className = "label-div";
      ingredientsDiv.appendChild(labelDiv);

      // Crée titre
      const ingredientTitle = document.createElement("h4");
      ingredientTitle.textContent = "Ingredients";
      ingredientsDiv.appendChild(ingredientTitle);

      // Pour afficher les étiquettes "gluten free", "dairy free"
      if (data.diets.includes("gluten free")) {
        // Créez un élément d'étiquette (par exemple, une balise <span>) pour "gluten free"
        const glutenFreeLabel = document.createElement("span");
        glutenFreeLabel.className = "label gluten";
        glutenFreeLabel.textContent = "gluten free";
        // Ajoutez cet élément au DOM (par exemple, à un conteneur avec un ID spécifique)
        labelDiv.appendChild(glutenFreeLabel);
      }
      if (data.diets.includes("dairy free")) {
        // Créez un élément d'étiquette (par exemple, une balise <span>) pour "gluten free"
        const dairyFreeLabel = document.createElement("span");
        dairyFreeLabel.className = "label dairy";
        dairyFreeLabel.textContent = "dairy free";
        // Ajoutez cet élément au DOM (par exemple, à un conteneur avec un ID spécifique)
        labelDiv.appendChild(dairyFreeLabel);
      }
      if (data.diets.includes("vegan")) {
        // Créez un élément d'étiquette (par exemple, une balise <span>) pour "gluten free"
        const veganLabel = document.createElement("span");
        veganLabel.className = "label vegan";
        veganLabel.textContent = "vegan";
        // Ajoutez cet élément au DOM (par exemple, à un conteneur avec un ID spécifique)
        labelDiv.appendChild(veganLabel);
      }

      // En considérant que les ingrédients sont stockés dans un tableau d'objets dans la section 'extendedIngredients'
      data.extendedIngredients.forEach(function (oneIngredient) {
        const ingredientElement = document.createElement("li");
        if (oneIngredient.measures.metric.amount < 1) {
          ingredientElement.innerHTML = `<b>1 ${oneIngredient.measures.metric.unitShort}</b> ${oneIngredient.name}`;
        } else {
          ingredientElement.innerHTML = `<b>${parseInt(
            oneIngredient.measures.metric.amount
          )} ${oneIngredient.measures.metric.unitShort}</b> ${
            oneIngredient.name
          }`;
        }

        /*ingredientElement.textContent += oneIngredient.measures.metric.unitShort;
            ingredientElement.textContent = oneIngredient.name;*/
        ingredientsDiv.appendChild(ingredientElement);
      });

      const instruction = document.createElement("details");
      instruction.className = "instruction-block";
      instruction.innerHTML = `<summary>Recipe</summary>`;
      instruction.setAttribute("open", "false");

      // Crée une div pour les instructions. On l'inclut dans instruction
      const instructionsList = document.createElement("ol");
      instructionsList.className = "instructions";
      instruction.appendChild(instructionsList);

      if (typeof data.analyzedInstructions[0] === "undefined") {
        instructionsList.innerHTML = `<p><b>Get on with it!</b> The author of this recipe has not given any instructions...</p>`;
      } else if (data.analyzedInstructions[0].steps.length !== 1) {
        // En considérant que les instructions sont stockés dans un tableau d'objets dans la section 'analyzedInstructions'
        data.analyzedInstructions[0].steps.forEach(function (oneInstruction) {
          const instructionSingleElement = document.createElement("li");
          instructionSingleElement.textContent = oneInstruction.step;
          instructionsList.appendChild(instructionSingleElement);
        });
      } else {
        const instructionSingleElement = document.createElement("p");
        instructionSingleElement.textContent =
          data.analyzedInstructions[0].steps[0].step;
        instructionsList.appendChild(instructionSingleElement);
      }

      //ajout des Indices Nutritionnels
      const nutritionFacts = document.createElement("div");
      nutritionFacts.className = "nutrition-facts";

      const calories = parseInt(
        data.nutrition.nutrients.find((element) => element.name === "Calories")
          .amount
      );
      const fat = parseInt(
        data.nutrition.nutrients.find((element) => element.name === "Fat")
          .amount
      );
      const sat_fat = parseInt(
        data.nutrition.nutrients.find(
          (element) => element.name === "Saturated Fat"
        ).amount
      );
      const carbs = parseInt(
        data.nutrition.nutrients.find(
          (element) => element.name === "Carbohydrates"
        ).amount
      );
      const prot = parseInt(
        data.nutrition.nutrients.find((element) => element.name === "Protein")
          .amount
      );

      nutritionFacts.innerHTML = `<p><span>Energy</span> ${calories} kcal</p> <p><span>Fat</span> ${fat}g</p> <p><span>Saturated Fat</span> ${sat_fat}g</p> <p><span>Carbohydrates</span> ${carbs}g</p> <p><span>Protein</span> ${prot}g</p>`;

      // Ajoute imageDiv & ingredientsDiv au wrapper
      parentDiv.appendChild(imageDiv);

      const ingredientsInstructionsDiv = document.createElement("div");
      ingredientsInstructionsDiv.className = "ingredients-instruction";

      ingredientsInstructionsDiv.appendChild(ingredientsDiv);

      parentDiv.appendChild(ingredientsInstructionsDiv);

      // Ajoute la div parente au conteneur principal (wrapper)
      wrapper.appendChild(parentDiv);
      wrapper.appendChild(instruction);
      wrapper.appendChild(nutritionFacts);
    } catch (error) {
      console.error(error);
    }
  }
});

/*single_image.addEventListener.addEventListener("click", (e) => {
  if (e.target.id ==="single") {
    window.scrollTo(0, 0);

    const img = e.target.parentElement.querySelector("img");

    const imgId = img.id;

    const backgroundImageUrl = window.getComputedStyle(img).backgroundImage;
    const cleanedImageUrl = backgroundImageUrl.slice(5, -2);
    console.log("URL de l'image de fond :", cleanedImageUrl);

    const h4Content =
      e.target.parentElement.parentElement.querySelector("h4").textContent;
    console.log("Contenu de la balise <h4> :", h4Content);

    savedRecipes.push({
      image: cleanedImageUrl,
      title: h4Content,
      id: imgId,
    });
    console.log(savedRecipes);
    printSavedRecipes(savedRecipes);
  }
});*/
wrapper.addEventListener("click", (e) => {
  if (e.target.id === "multi") {
    window.scrollTo(0, 0);
    const imageDiv = e.target.parentElement.parentElement;

    const divId = imageDiv.id;
    console.log("ID de la div :", divId);

    const backgroundImageUrl =
      window.getComputedStyle(imageDiv).backgroundImage;
    const cleanedImageUrl = backgroundImageUrl.slice(5, -2);
    console.log("URL de l'image de fond :", cleanedImageUrl);

    const h3Content = imageDiv.querySelector("h3").textContent;
    console.log("Contenu de la balise <h3> :", h3Content);

    savedRecipes.push({
      image: cleanedImageUrl,
      title: h3Content,
      id: divId,
    });
    console.log(savedRecipes);
    printSavedRecipes(savedRecipes);
  } else if (e.target.id === "single") {
    window.scrollTo(0, 0);

    const img = e.target.parentElement.parentElement.querySelector("img");

    const imgId = e.target.parentElement.parentElement.id;
    console.log("l'id de la div:", imgId);

    const imageUrl = img.getAttribute("src");
    console.log("contenu de src= :", imageUrl);
    //const cleanedImageUrl = imageUrl.slice(5, -2);
    //console.log("URL de l'image de fond :", cleanedImageUrl);

    const h4Content = e.target
      .closest(".recipe_result")
      .querySelector("h4").textContent;
    console.log("Contenu de la balise <h4> :", h4Content);

    savedRecipes.push({
      image: imageUrl,
      title: h4Content,
      id: imgId,
    });
    console.log("La deuxième méthode");
    console.log(savedRecipes);
    printSavedRecipes(savedRecipes);
  }
});

second_stage.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    let positionInTab = parseInt(
      e.target.parentElement.getAttribute("data-index")
    );
    deleteIngredient(positionInTab);
  }
});

/*https://api.spoonacular.com/recipes/complexSearch?apiKey=8565a82cbb824636a7f9b75b960b1233&query=pasta&addRecipeInstructions=true&instructionsRequired=true*/

/*

data.results.forEach(async function (oneResult) {
      console.log(oneResult.id);
      // On s'assure que la 1ère lettre de chaque titre soit en majuscule
      const recipeTitle =
        oneResult.title.charAt(0).toUpperCase() + oneResult.title.slice(1);

      const url = `https://api.spoonacular.com/recipes/${oneResult.id}/information`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "1a2bd81babmsh83f60e5688664e8p194a55jsn3f4dfe85a532",
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        },
      };
      try {
        const response = await fetch(url, options);
        const result = await response.text();
        const data = JSON.parse(result);
        console.log(`2e data : ${data}`);
      } catch (error) {
        console.error(error);
      }
    });

*/
