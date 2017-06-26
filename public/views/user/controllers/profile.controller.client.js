(function () {
    angular
        .module('FinalProject')
        .controller('profileController', profileController);

    function profileController($routeParams, userService, $location, currentUser, storeService) {

        var model = this;
        model.sectionTitle = "Profile";

        model.render = render;
        model.follow = follow;
        model.unfollow = unfollow;
        model.sendMessage = sendMessage;
        model.showFollowers = showFollowers;
        model.showFollowings = showFollowings;
        model.showLikedRecipes = showLikedRecipes;
        model.showCollectedProducts = showCollectedProducts;
        model.countPhotoWidth = countPhotoWidth;
        model.navToStorePage = navToStorePage;

        // model.showRecipes = showRecipes;
        // model.showProducts = showProducts;

        function init() {
            if ($routeParams.uid) {
                model.userId = $routeParams.uid;
            } else {
                model.userId = currentUser._id;
            }

            countPhotoWidth();

            // console.log(model.userId);

            // console.log(currentUser.roles.indexOf("MERCHANT"));
            render(model.userId);
            showLikedRecipes();

            model.recipeOrProduct = 'RECIPE';

            // TODO: TEST
            if (currentUser.role === 'RECIPEPRO') {
                model.isRecipeProvider = true;
            }
            //TODO: END OF TEST
        }

        init();
        function render(userId) {
            userService
                .findUserById(userId)
                .then(function (user) {
                    model.user = user;

                    if (model.user.followers.indexOf(currentUser._id) > -1) {
                        model.followed = true;
                    } else {
                        model.followed = false;
                    }
                    console.log(model.user.role);
                })
        }

        function showLikedRecipes() {
            userService
                .populateArr(model.userId, 'likedRecipes')
                .then(function (likedRecipes) {
                    console.log(likedRecipes);
                    model.likedRecipes = likedRecipes;
                    model.recipeOrProduct = 'RECIPE';
                    console.log(model.likedRecipes)
                });


        }

        function showCollectedProducts() {
            userService
                .populateArr(model.userId, 'collectedProducts')
                .then(function (products) {
                    model.collectedProducts = products;
                })
            model.recipeOrProduct = 'PRODUCT';
        }

        function follow() {
            userService
                .follow(model.userId)
                .then(function (user) {
                    model.render(model.userId);
                })
        }

        function unfollow() {
            userService
                .unfollow(model.userId)
                .then(function (user) {
                    model.render(model.userId);
                })
        }

        function sendMessage(message) {
            userService
                .sendMessage(model.userId, [message])
                .then(function (user) {
                    model.message = "";
                })
        }

        function showFollowings() {
            userService
                .populateArr(model.userId, 'followings')
                .then(function (followings) {
                    model.follows = followings;
                    $location.url = "#followDetail";

                    if (model.followType === 'followers') {
                        $("#followDetail").collapse('show');
                    } else {
                        $("#followDetail").collapse('toggle');
                    }
                    model.followType = 'followings';
                    // console.log(model.follows);
                })
        }

        function showFollowers() {
            userService
                .populateArr(model.userId, 'followers')
                .then(function (followers) {
                    model.follows = followers;
                    $location.url = "#followDetail";
                    if (model.followType === 'followings') {
                        $("#followDetail").collapse('show');
                    } else {
                        $("#followDetail").collapse('toggle');
                    }
                    model.followType = 'followers';

                })
        }

        function countPhotoWidth() {
            console.log(screen.width);
            if (screen.width > 500) {
                model.profilePhotoWidth = '40%';
            } else {
                model.profilePhotoWidth = '100%';
            }
        }



        function checkCurrentProfileRole() {
            if ($routeParams.uid) {
                userService
                    .findUserById($routeParams.uid)
                    .then(function (user) {
                        identifyRole(user);
                    });
            } else {
                identifyRole(currentUser);
            }
        }

        function identifyRole(user) {
            switch (user.role) {
                case 'RECIPEPRO':
                    model.isRecipeProvider = true;
                    break;
                case 'MERCHANT':
                    model.isMerchant = true;
                    break;
                case 'ADMIN':
                    model.isAdmin = true;
                    break;
                default:
                    model.generalUser = true;
            }
        }

        function navToRecipeListPage() {
            if ($routeParams.uid) {
                $location.url("/creator/" + $routeParams.uid + "/recipe_list");
            } else {
                $location.url("/auth_recipe_list");
            }
        }

        function navToStorePage() {
            if ($routeParams.uid) {
                storeService
                    .findAllStoresForOwner($routeParams.uid)
                    .then(function (data) {
                        if (data.length > 0){
                            $location.url('/store/' + data[0]._id);
                        }
                    })
            } else {
                if (currentUser.role === "MERCHANT") {
                    storeService
                        .findAllStoresForOwner(currentUser._id)
                        .then(function (data) {
                                if (data.length === 0) {
                                    $location.url('/store/undefined/new');
                                } else {
                                    $location.url('/store/' + data[0]._id);
                                }
                            }
                        );
                }
            }


        }
    }
})();

