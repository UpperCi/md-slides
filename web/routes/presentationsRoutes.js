const express = require('express');

const Presentation = require('../models/presentationModel.js');

const reqUrl = (req) => `http://${req.headers.host}${req.baseUrl}/`;

let routes = function () {
    let presentationsRouter = express.Router();

    presentationsRouter.route('/')

        .options(function (req, res) {
            res.header({ 'Allow': 'GET,POST,OPTIONS' });
            res.send();
        })

        .post(function (req, res) {
            let presentation = new Presentation(req.body);

            presentation.save(function (err) {
                res.status(201).send(presentation);
            });
        })

        .delete(function (req, res) {
            Presentation.deleteMany({}, function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json("deleted all presentations");
                }
            });
        })

        .get(function (req, res) {
            Presentation.find({}, function (err, presentations) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    let baseUrl = reqUrl(req);
                    for (let i in presentations) {
                        presentations[i]._links = {
                            'self' : {
                                'href' : baseUrl + presentations[i]._id
                            },
                            'collection' : {
                                'href' : baseUrl
                            }
                        }
                    }
                    res.json({
                        'items' : presentations,
                        '_links' : {
                            'self' : {
                                'href' : baseUrl
                            },
                            'collection' : {
                                'href' : baseUrl
                            }
                        }
                    });
                }
            });
        });

    presentationsRouter.options('/:presentationId', async (req, res) => {
        res.header({ 'Allow': 'GET,POST,DELETE,PUT,OPTIONS' });
        res.send();
    });

    presentationsRouter.get('/:presentationId', async (req, res) => {
        try {
            const presentation = await Presentation.findById(req.params.presentationId);
            res.json(presentation);
        } catch (err) {
            res.status(404).send(err);
        }
    });

    presentationsRouter.delete('/:presentationId', async (req, res) => {
        try {
            const presentation = await Presentation.findById(req.params.presentationId);
            presentation.delete();
            res.json("deleted presentation");
        } catch (err) {
            res.status(404).send(err);
        }
    });

    return presentationsRouter;
};

module.exports = routes;
