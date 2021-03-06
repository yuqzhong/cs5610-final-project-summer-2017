(function () {
    angular
        .module("FinalProject")
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './views/home/templates/home.view.client.html',
                controller: 'homeController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkCurrentUser
                }
            })
            .when('/login', {
                templateUrl: './views/user/templates/login.view.client.html',
                controller: 'loginController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkCurrentUser
                }
            })
            .when('/register', {
                templateUrl: './views/user/templates/register.view.client.html',
                controller: 'registerController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkCurrentUser
                }

            })
            .when('/account', {
                templateUrl: './views/user/templates/account.view.client.html',
                controller: 'accountController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/account/photo', {
                templateUrl: './views/user/templates/snippets/photo.view.client.html',
                controller: 'photoController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/account/message', {
                templateUrl: './views/user/templates/snippets/inbox.view.client.html',
                controller: 'inboxController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/account/calorie', {
                templateUrl: './views/user/templates/calorie.view.client.html',
                controller: 'calorieController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/profile', {
                templateUrl: './views/user/templates/profile.view.client.html',
                controller: 'profileController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/profile/:uid', {
                templateUrl: './views/user/templates/profile.view.client.html',
                controller: 'profileController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })

            .when('/admin', {
                templateUrl: './views/admin/templates/admin.view.client.html',
                controller: 'adminController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/users', {
                templateUrl: './views/admin/templates/admin-users.view.client.html',
                controller: 'adminUsersController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/user/:userId', {
                templateUrl: './views/admin/templates/admin-user-detail.view.client.html',
                controller: 'adminUserDetailController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/stores', {
                templateUrl: './views/admin/templates/admin-stores.view.client.html',
                controller: 'adminStoresController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/merchandises', {
                templateUrl: './views/admin/templates/admin-merchandises.view.client.html',
                controller: 'adminMerchandisesController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/recipes', {
                templateUrl: './views/admin/templates/admin-recipes.view.client.html',
                controller: 'adminRecipesController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/comments', {
                templateUrl: './views/admin/templates/admin-comments.view.client.html',
                controller: 'adminCommentsController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkAdmin
                }
            })

            .when("/recipe_list", {
                templateUrl: "views/recipe/templates/recipe-list.view.client.html",
                controller: "recipeListController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkCurrentUser
                }
            })

            .when('/recipe_list/:recipeId', {
                templateUrl: 'views/recipe/templates/otherUser/recipe-detail.view.client.html',
                controller: 'recipeDetailController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/recipe_list/:recipeId/ingredient/:ingredientName', {
                templateUrl: 'views/recipe/templates/otherUser/ingredient-detail.view.client.html',
                controller: 'ingredientDetailController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/auth_recipe_list', {
                templateUrl: 'views/recipe/templates/creator/recipe-list-by-creator.view.client.html',
                controller: 'recipeListByCreatorController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/auth_recipe_list/:recipeId', {
                templateUrl: 'views/recipe/templates/creator/recipe-edit.view.client.html',
                controller: 'recipeEditController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/creator/:creatorId/recipe_list', {
                templateUrl: 'views/recipe/templates/creator/recipe-list-by-creator.view.client.html',
                controller: 'recipeListByCreatorController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            // .when('/creator/:creatorId/recipe/:recipeId', {
            //     templateUrl: 'views/recipe/templates/creator/recipe-edit.view.client.html',
            //     controller: 'recipeEditController',
            //     controllerAs: 'model',
            //     resolve: {
            //         currentUser: checkLoggedin
            //     }
            // })
            .when('/store/:storeId/merchandise', {
                templateUrl: './views/merchandise/templates/merchandise-list.view.client.html',
                controller: 'merchandiseListController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/store/:storeId/merchandise/:merchandiseId', {
                templateUrl: './views/merchandise/templates/merchandise-detail.view.client.html',
                controller: 'merchandiseDetailController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/store/:storeId/merchandise/:merchandiseId/:mode', {
                templateUrl: './views/merchandise/templates/merchandise-edit.view.client.html',
                controller: 'merchandiseEditController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/store/:storeId', {
                templateUrl: 'views/store/templates/store-profile.view.client.html',
                controller: 'storeProfileController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/store/:storeId/:mode', {
                templateUrl: 'views/store/templates/store-profile-edit.view.client.html',
                controller: 'storeProfileEditController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin
                }
            })
            .when('/store-search-near-by', {
                templateUrl: 'views/store/templates/store-search-near-by.view.client.html',
                controller: 'StoreSearchNearByController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkCurrentUser
                }
            })
            .when('/search/store', {
                templateUrl: 'views/store/templates/store-profile-search.view.client.html',
                controller: 'storeProfileSearchController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkCurrentUser
                }
            })
            .when('/search/user', {
                templateUrl: 'views/user/templates/user-search.view.client.html',
                controller: 'userSearchController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkCurrentUser
                }
            })
            .when('/search/merchandise', {
                templateUrl: 'views/merchandise/templates/merchandise-search-list.view.client.html',
                controller: 'merchandiseSearchController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkCurrentUser
                }
            })
            .otherwise({redirectTo: '/'})
    }

    function checkLoggedin(userService, $q, $location) {
        var deferred = $q.defer();
        userService
            .loggedin()
            .then(function (user) {
                if (user === '0') {
                    deferred.reject();
                    $location.url('/login');
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function checkCurrentUser(userService, $q, $location) {
        var deferred = $q.defer();
        userService
            .loggedin()
            .then(function (user) {
                if (user === '0') {
                    deferred.resolve({});
                } else {
                    deferred.resolve(user);
                }
            })
            .catch(function (error) {
            });
        return deferred.promise;
    }

    function checkAdmin(userService, $q, $location) {
        var deferred = $q.defer();
        userService
            .checkAdmin()
            .then(function (user) {
                if (user === '0') {
                    deferred.reject();
                    $location.url('/');
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
})();
