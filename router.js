"use strict";
let fs = require('fs');
let express = require('express');
let router = express.Router();
let def = require('./definitions');
let messages = require('./messages');
let sqlAny = require('./sqlAny');

router.post('/api/gstr1', (req, res, next) => {
    try
    {
        let options = req.body;
        sqlAny.executeSql(options, (error, result) => {
            error
                ? res.json({error:error})
                : res.json(result);
        })
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});
module.exports = router;