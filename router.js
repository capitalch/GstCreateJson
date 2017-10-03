"use strict";
let fs = require('fs');
let express = require('express');
let router = express.Router();
let def = require('./definitions');
let messages = require('./messages');
let sqlAny = require('./sqlAny');

router.get('/api/gstr1', (req, res, next) => {
    try
    {
        let options = {
            dbName: 'capi2017',
            sqlKey: 'gstr1:test',
            args: {}
        }
        sqlAny.executeSql(options, (error, result) => {
            error
                ? console.log(error)
                : res.json(result);
        })
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});
module.exports = router;