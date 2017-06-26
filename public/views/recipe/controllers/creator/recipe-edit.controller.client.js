(function () {
    angular
        .module("FinalProject")
        .controller("recipeEditController", RecipeEditController);

    function RecipeEditController($routeParams, $location, recipeService, currentUser, userService) {

        var model = this;

        model.creatorId = $routeParams.creatorId;
        model.recipeId = $routeParams.recipeId;

        model.sectionTitle = "Edit Recipe";

        model.createSingleIngredient = createSingleIngredient;
        model.selectSingleIngredient = selectSingleIngredient;
        model.editSingleIngredient = editSingleIngredient;
        model.deleteSingleIngredient = deleteSingleIngredient;
        model.clearSingleIngredient = clearSingleIngredient;
        model.updateRecipe = updateRecipe;
        model.deleteRecipe = deleteRecipe;
        model.saveRecipe = saveRecipe;
        model.logout = logout;

        function init() {

            if ((currentUser._id !== model.creatorId) && (currentUser.role !== 'ADMIN')) {
                $location.url('/');
            }

            if (currentUser._id) {
                model.ifLoggedIn = true;
            }


            model.newIngredient = {};

            ifNewRecipe();

            recipeService
                .findAllRecipesForCreator(model.creatorId)
                .then(function (recipes) {
                    model.recipes = recipes;
                });
            //TODO: is it possible to have a list of recipe of one person and the editing recipe of another?
            recipeService
                .findRecipeById(model.recipeId)
                .then(function (recipe) {
                    model.recipe = recipe;
                })
        }

        init();

        function logout() {
            userService
                .logout()
                .then(function () {
                    $location.url('/');
                });
        }

        function ifNewRecipe() {
            return $location.hash() ? model.ifNewRecipe = true : model.ifNewRecipe = false;
        }

        function createSingleIngredient() {
            if (model.newIngredient.name) {
                model.recipe.ingredients.push(model.newIngredient);
                model.error = "";
                model.newIngredient = {};
            } else {
                model.error = "New ingredient name can't be empty.";
            }
        }

        function clearSingleIngredient() {
            model.error = "";
            model.newIngredient = {};
        }

        function selectSingleIngredient(ingredient) {
            model.editIngredient = ingredient;
        }

        function editSingleIngredient(ingredient) {
            if (ingredient.name) {
                model.editIngredient = {};
                model.error = "";
            } else {
                model.error = "Ingredient name can't be empty.";
            }
        }

        function deleteSingleIngredient(ingredient) {
            var index = model.recipe.ingredients.indexOf(ingredient);
            model.recipe.ingredients.splice(index, 1);
            model.error = "";
        }

        function saveRecipe() {
            return recipeService
                .updateRecipe(model.recipeId, model.recipe)
        }

        function updateRecipe() {
            // recipeService
            //     .updateRecipe(model.recipeId, model.recipe)
            //     .then(function () {
            //         model.message = "Update successful!";
            //         $location.url("/creator/" + model.creatorId + "/recipe/")
            //     }, function () {
            //         model.error = "can't update at this time, please try later.";
            //     })
            saveRecipe()
                .then(function () {
                    model.message = "Update successful!";
                    $location.url("/creator/" + model.creatorId + "/recipe/")
                }, function () {
                    model.error = "can't update at this time, please try later.";
                })


        }

        function deleteRecipe() {
            recipeService
                .deleteRecipe(model.recipeId)
                .then(function () {
                    $location.url("/creator/" + model.creatorId + "/recipe/");
                }, function () {
                    model.error = "can't delete at this time, please try later.";
                })
        }

    }
})();
