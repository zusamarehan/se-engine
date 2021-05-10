require('dotenv').config()

const classify = require('./classifer');
const express = require('express')
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser')

const knex = require('knex')({
    client: 'pg',
    connection: {
        host : process.env.PGHOST,
        user : process.env.pguser,
        password : process.env.pgpassword,
        database : process.env.pgdatabase
    },
    pool: { min: 0, max: 7 }
});
const app = express()

app.use( bodyParser.json() );

app.get('/', function (req, res) {
    res.send('Hello World!')
})
// GET Receiver
app.get('/success/receiver', function (req, res) {
    knex
        .select("id", "data", "processed", "time")
        .from("success_logger")
        .then(function(result) {
            res.json({ success: true, data: result });
        }).catch(function(err) {
            res.json({ success: false, message: err });
        })
})
// POST Receiver
app.post('/success/receiver', function (req, res) {
    knex('success_logger').insert({
        "data" : req.body,
        "id" : uuidv4(),
    }).then(function(result) {
        res.json({ success: true, message: 'ok' });
    }).catch(function(err) {
        res.json({ success: false, message: err });
    })
})
// GET - Classifier
app.get('/success/classifier', function(req, res) {
    knex
        .select("id", "data", "time", "processed")
        .from("success_logger")
        .where('processed', false)
        .orderBy('time', 'asc')
        .then(function(result) {
            result.forEach(function (item, index) {
                classify.classifier(item);
                knex('success_logger')
                    .where('id', item.id)
                    .update('processed', true)
                    .then(function(res) {
                        console.log({ success: true, message: 'ok' })
                    }).catch(function(err) {
                        console.log({ success: true, message: err });
                    })
            })
            res.json({ success: false, message: 'ok' });
        }).catch(function(err) {
            res.json({ success: false, message: err });
        })
})
// GET Valid Request
app.get('/success/classifier/valid', function (req, res) {
    knex
        .select("id", "data", "time")
        .from("success_valid")
        .then(function(result) {
            res.json({ success: true, data: result });
        }).catch(function(err) {
        res.json({ success: false, message: err });
        })
})
// GET Invalid Request
app.get('/success/classifier/invalid', function (req, res) {
    knex
        .select("id", "data", "time")
        .from("success_invalid")
        .then(function(result) {
            res.json({ success: true, data: result });
        }).catch(function(err) {
        res.json({ success: false, message: err });
    })
})

// Data Dump
app.post('/dump', function (req, res) {
    for(let i = 0; i <= 500; i++) {
        knex('success_logger').insert({
            "data" : {
                "slug": "acmeinc",
                "productId": uuidv4(),
                "projectId": uuidv4(),
                "userEmail": "usama.rehan@success.app",
                "data" : {
                    'value': Math.random()
                }
            },
            "id" : uuidv4(),
        }).then(function(result) {
            res.json({ success: true, message: 'ok' });
        }).catch(function(err) {
            res.json({ success: false, message: err });
        })
    }
    for(let i = 0; i <= 500; i++) {
        knex('success_logger').insert({
            "data" : {
                "slug": "acmeinc",
                "productId": uuidv4(),
                "projectId": uuidv4(),
                "userEmail": "usama.rehan@success.app",
                "data" : 12
            },
            "id" : uuidv4(),
        }).then(function(result) {
            res.json({ success: true, message: 'ok' });
        }).catch(function(err) {
            res.json({ success: false, message: err });
        })
    }
})
app.listen(8081, () => {
    console.log('Application listening on port 8081!');
});