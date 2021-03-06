var app = require('../../express');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../../public/uploads/merchandise/picture'});

var merchandiseModel = require('../models/merchandise/merchandise.model.server');

app.post('/api/store/:storeId/merchandise', createMerchandise);
app.get('/api/store/:storeId/merchandise', findAllMerchandisesForStore);
app.get('/api/merchandise/:merchandiseId', findMerchandiseById);
app.get('/api/merchandise/name/:name', findMerchandiseByName);
app.get('/api/merchandises', isAdmin, findAllMerchandises);

app.put('/api/merchandise/:merchandiseId', updateMerchandise);
app.delete('/api/merchandise/:merchandiseId', deleteMerchandise);

app.post('/api/upload/merchandise/picture', upload.single('myFile'), uploadImage);


function uploadImage(req, res) {
    if (req.file === undefined) {
        res.status(404);
        return;
    }

    var myFile = req.file;
    var storeId = req.body.storeId;
    var merchandiseId = req.body.merchandiseId;
    var filename = myFile.filename;

    merchandiseModel
        .uploadImage(merchandiseId, filename)
        .then(function (status) {
            var callbackUrl = "/#!/store/" + storeId + "/merchandise/" + merchandiseId;
            res.redirect(callbackUrl)
        });
}


function createMerchandise(req, res) {
    var merchandise = req.body;
    var storeId = req.params.storeId;
    merchandiseModel
        .createMerchandise(storeId, merchandise)
        .then(function (merchandise) {
                res.status(200).json(merchandise);
            },
            function () {
                res.sendStatus(500);
            }
        )
}

function findAllMerchandisesForStore(req, res) {
    var storeId = req.params.storeId + "";

    merchandiseModel
        .findAllMerchandisesForStore(storeId)
        .then(function (merchandises) {
                res.status(200).send(merchandises);

            },
            function () {
                res.sendStatus(500);
            });
}

function findAllMerchandises(req, res) {
    merchandiseModel
        .findAllMerchandises()
        .then(function (merchandises) {
            res.status(200).send(merchandises);
        });
}

function findMerchandiseById(req, res) {
    var merchandiseId = req.params.merchandiseId + "";

    merchandiseModel
        .findMerchandiseById(merchandiseId)
        .then(
            function (merchandise) {
                res.status(200).send(merchandise);
            },
            function () {
                res.sendStatus(500);
            }
        )
}


function findMerchandiseByName(req, res) {
    var merchandiseName = req.params.name + "";

    merchandiseModel
        .findMerchandiseByName(merchandiseName)
        .then(
            function (merchandises) {
                res.status(200).send(merchandises);
            },
            function () {
                res.sendStatus(500);
            }
        )
}

function updateMerchandise(req, res) {
    var merchandiseId = req.params.merchandiseId + "";
    var merchandise = req.body;

    merchandiseModel
        .updateMerchandise(merchandiseId, merchandise)
        .then(
            function (merchandise) {
                res.status(200).send(merchandise);
            },
            function () {
                res.sendStatus(500);
            }
        )

}

function deleteMerchandise(req, res) {
    var merchandiseId = req.params.merchandiseId + "";

    merchandiseModel
        .deleteMerchandise(merchandiseId)
        .then(
            function () {
                res.status(200).send("merchandise delete successfully");
            },
            function () {
                res.sendStatus(500);
            }
        )
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'ADMIN') {
        next();
    } else {
        res.sendStatus(401);
    }
}


