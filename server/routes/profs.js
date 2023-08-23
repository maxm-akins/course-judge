const express = require("express");
const router = express.Router();
require("dotenv").config();
const verifyJWT = require("../middleware/verifyJWT");
const SchoolModel = require("../models/SchoolModel");
const { randomUUID } = require('crypto');
const short = require('short-uuid');
const ClassesModel = require("../models/ClassesModel");
const ProfModel = require("../models/ProfModel");
const ReviewsModels = require("../models/ReviewsModels")


router.get('/', async (req, res) => {
    const q = req.params.q;
    try {
        const prof = new ProfModel({});
        prof.name = "John Rameriez"
        prof.uuid = short.generate();

        prof.save().then(() => {
            console.log("new prof saved");
            res.status(200).json({ message: "Data Successfully Created." });
            return
        },
            (err) => {
                console.log(err);
                res.status(err.status || 400).json({ message: err.message });
                return;

            })

    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});


router.get('/search/:school/:course/:q', async (req, res) => {
    try {
        const school = req.params.school;
        const course = req.params.course;
        const q = req.params.q;
        console.log("q " + q);
        console.log("school " + school);
        console.log("course " + course);

        // Start building the search aggregation stage
        let searcher_aggregate = {
            "$search": {
                "index": 'prof_search',
                "compound": {
                    "must": [
                        {
                            "text": {
                                "query": school,
                                "path": ['schoolRefs', 'schoolRef'],
                            }
                        },

                    ],
                    "mustNot": [
                        {
                            "text": {
                                "query": course,
                                "path": 'courseRefs',
                            },

                        },


                    ],
                    "should": [
                        {
                            "text": {
                                "query": q,
                                "path": 'name',
                                "fuzzy": {}
                            },
                        },
                    ],

                }
            }
        };

        let projection = {
            '$project': {
                'name': 1,
                'fullName': 1,
                'uuid': 1,
                "_id": 0

            }
        };


        let results = await ProfModel.aggregate([searcher_aggregate, projection]).limit(50);
        console.log(results)
        res.send(results).status(200);

    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});



router.get('/search/:school/:q', async (req, res) => {
    try {
        const school = req.params.school;
        const q = req.params.q;
        console.log("q " + q);
        console.log("school " + school);

        // Start building the search aggregation stage
        let searcher_aggregate = {
            "$search": {
                "index": 'prof_search',
                "compound": {
                    "must": [
                        {
                            "text": {
                                "query": school,
                                "path": ['schoolRefs', 'schoolRef'],
                            }
                        },

                    ],
                    "should": [
                        {
                            "text": {
                                "query": q,
                                "path": 'name',
                                "fuzzy": {}
                            },
                        },
                    ],

                }
            }
        };

        let projection = {
            '$project': {
                'name': 1,
                'fullName': 1,
                'uuid': 1,
                "department": 1,
                "_id": 0

            }
        };


        let results = await ProfModel.aggregate([searcher_aggregate, projection]).limit(50);
        console.log(results)
        res.send(results).status(200);

    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});


module.exports = router;
