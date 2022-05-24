const express = require('express');

const Presentation = require('../models/presentationModel.js');

const reqUrl = (req) => `http://${req.headers.host}${req.baseUrl}/`;
const acceptedTypes = ["application/json", "application/x-www-form-urlencoded"];

function getLinks(req, id = "") {
    let baseUrl = reqUrl(req);
    return {
        'self': {
            'href': baseUrl + id
        },
        'collection': {
            'href': baseUrl
        }
    };
}

let routes = function () {
    let presentationsRouter = express.Router();

    presentationsRouter.use('/', (req, res, next) => {
        console.log("-------- Request --------");
        console.log(req.method);
        console.log(req.query);
        console.log(req.get("Accept"));
        console.log(req.get("Content-Type"));
        console.log(req.body);
        console.log(req.url);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Methods", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        if (req.method === 'POST' || acceptedTypes.includes(req.get("Accept").toLowerCase())) {
            next();
        } else {
            res.status(400).send();
        }
    });

    presentationsRouter.route('/')
        .options(function (req, res) {
            res.header({ 'Allow': 'GET,POST,OPTIONS' });
            res.send();
        })

        .post(async function (req, res) {
            let presentation = new Presentation({ ...req.body, '_links': {} });

            presentation.save(function (err) {
                let valid = presentation.validateSync();
                if (valid != undefined) {
                    res.status(400).send(valid);
                } else {
                    res.status(201).send(presentation);
                }
            });
        })

        .delete(function (req, res) {
            res.status(404).send();
        })

        .get(async function (req, res) {
            const totalItemCount = await Presentation.estimatedDocumentCount();
            let page = req.query.start;
            let limit = req.query.limit;

            page = page ? parseInt(page) : 1;
            limit = limit ? parseInt(limit) : totalItemCount;

            let start = (page - 1) * limit;

            start = start ? start : 1;

            let lastPage = Math.ceil(totalItemCount / limit);

            let findCallback = (err, presentations) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    let baseUrl = reqUrl(req);
                    let links = {
                        "_links": getLinks(req)
                    };
                    
                    let nextPage = (page % lastPage) + 1;
                    let previousPage = Math.max(1, page - 1);
                    let currentItems = (page == lastPage) ? (totalItemCount % (limit + 1)) : limit;
                    let pagination = {
                        'pagination': {
                            'currentPage': page,
                            'currentItems': currentItems,
                            'totalPages': lastPage,
                            'totalItems': totalItemCount,
                            '_links' : {
                                'first': {
                                    'page': 1,
                                    'href': baseUrl + `?start=1&limit=${limit}`
                                },
                                'last': {
                                    'page': lastPage,
                                    'href': baseUrl + `?start=${lastPage}&limit=${limit}`
                                },
                                'next': {
                                    'page': nextPage,
                                    'href': baseUrl + `?start=${nextPage}&limit=${limit}`
                                },
                                'previous': {
                                    'page': previousPage,
                                    'href': baseUrl + `?start=${previousPage}&limit=${limit}`
                                }
                            }
                        }
                    };
                    for (let i in presentations) {
                        presentations[i]._links = getLinks(req, presentations[i]._id);
                    }
                    res.json({
                        'items': presentations,
                        ...links,
                        ...pagination
                    });
                }
            };

            Presentation.find({}, null, { skip: start - 1, limit: limit }, findCallback);
        });

    presentationsRouter.options('/:presentationId', async (req, res) => {
        res.header({ 'Allow': 'GET,DELETE,PUT,OPTIONS' });
        res.send();
    });

    presentationsRouter.get('/:presentationId', async (req, res) => {
        try {
            const presentation = await Presentation.findById(req.params.presentationId);
            let links = getLinks(req, presentation._id);
            res.json({
                ...presentation._doc,
                "_links" : {...links}
            });
        } catch (err) {
            res.status(404).send(err);
        }
    });

    presentationsRouter.delete('/:presentationId', async (req, res) => {
        try {
            const presentation = await Presentation.findById(req.params.presentationId);
            presentation.delete();
            res.status(204).json("deleted presentation");
        } catch (err) {
            res.status(404).send(err);
        }
    });

    presentationsRouter.put('/:presentationId', async (req, res) => {
        let links = { "_links": getLinks(req, req.params.presentationId) };
        await Presentation.updateOne({ _id: req.params.presentationId }, {...req.body, _links: links});

        const presentation = await Presentation.findById(req.params.presentationId);
        
        let valid = presentation.validateSync();
        if (valid) {
            res.status(400).send("can't update");
        } else {
            res.status(200).json({
                ...presentation._doc,
                ...links
            });
        }
    });

    return presentationsRouter;
};

module.exports = routes;
