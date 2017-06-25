var mongoose = require('mongoose');
var associationSchema = require('./association.schema.server');
var associationModel = mongoose.model('associationModel', associationSchema);

associationModel.createAssociation = createAssociation;
associationModel.findAllRecipeReview = findAllRecipeReview;
associationModel.deleteRecipeLike = deleteRecipeLike;
associationModel.findLikeForRecipe = findLikeForRecipe;
associationModel.deleteComment = deleteComment;
associationModel.findCommentById = findCommentById;
associationModel.findAllComments = findAllComments;

associationModel.createMessage = createMessage;

module.exports = associationModel;

function findLikeForRecipe(userId, recipeId) {
    return associationModel
        .findOne({$and: [{fromWhom: userId}, {toRecipe: recipeId}]});
}

function deleteRecipeLike(likeId) {
    return associationModel
        .findByIdAndRemove(likeId);
}

function findAllRecipeReview(recipeId) {
    return associationModel
        .find({toRecipe: recipeId});
}

function createAssociation(comment) {
    //TODO:check role and association type
    return associationModel
        .create(comment)
        .then(function (comment) {
            return comment;
        })
}

function deleteComment(commentId) {
    return associationModel
        .remove(commentId)
        .then(function (status) {
            return status;
        })
        .catch(function (status) {
            console.log(status);
        })
}


function findCommentById(commentId) {
    return associationModel.findById(commentId);
}

function findAllComments() {
    return associationModel.find();
}

function createMessage(myId, userId, message) {
    var comment = {
        content: message,
        fromWhom: myId,
        toWhom: userId,
        type:'COMMENT'
    };
    return associationModel
        .createAssociation(comment)
        .then(function (message) {
            return message;
        })
}


