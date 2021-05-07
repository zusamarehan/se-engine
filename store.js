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
const { v4: uuidv4 } = require('uuid');

const storeValid = (data) => {
    knex('success_valid').insert({
        "data" : data,
        "id" : uuidv4(),
    })
    .then(function(result) {
        console.log({ success: true, message: 'ok' });
    }).catch(function(err) {
        console.log({ success: false, message: err });
    })
}

const storeInvalid = (data) => {
    knex('success_invalid').insert({
        "data" : data,
        "id" : uuidv4(),
    })
    .then(function(result) {
        console.log({ success: true, message: 'ok' });
    }).catch(function(err) {
        console.log({ success: false, message: err });
    })
}

exports.storeValid = storeValid;
exports.storeInvalid = storeInvalid;