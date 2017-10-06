"use strict";
let fs = require('fs');
let async = require('async');
let express = require('express');
let router = express.Router();
let def = require('./definitions');
let messages = require('./messages');
let sqlAny = require('./sqlAny');

router.post('/api/gstr1', (req, res, next) => {
    try {
        let options = req.body;
        sqlAny.executeSql(options, (error, result) => {
            error
                ? res.json({ error: error })
                : res.json(result);
        })
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.post('/api/gstr1/json', (req, res, next) => {
    try {
        let options = req.body;
        let ret;
        let sqls = ['get:gstn:no', 'get:gstr1:b2b', 'get:gstr1:b2cl', 'get:gstr1:hsn'];
        let resultSet = {};
        let fns = sqls.map(x => {
            let opts = Object.assign({},options, { sqlKey: x });
            let fn = (callback)=>{
                sqlAny.executeSql(opts, (error, result) => {
                    error
                        ? ret = { error: error }
                        : ret = result;
                    resultSet[x] = ret;
                    callback();
                })
            };
            return(fn);           
        });
        async.parallel(fns, function(err,result) {
            console.log(err);
            console.log(result);
            res.json(resultSet);
        });
        console.log(resultSet);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }


    // var user = { "name": "azraq", "country": "egypt" };
    // var json = JSON.stringify(user);
    // var filename = 'user.json';
    // var mimetype = 'application/json';
    // res.setHeader('Content-Type', mimetype);
    // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    // res.send(json);
});
module.exports = router;