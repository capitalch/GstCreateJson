"use strict";
let fs = require('fs');
let moment = require('moment');
let async = require('async');
let express = require('express');
let router = express.Router();
let def = require('./definitions');
let messages = require('./messages');
let sqlAny = require('./sqlAny');
let artifacts = require('./artifacts');

router.get('/api/gstr1/json', (req, res, next) => {
    try {
        let query = req.query;
        let monthNo = query.month;
        //moment.js assumes the first month i.e January as 0 and not 1
        let sdate = moment()
            .month(monthNo)
            .startOf('month')
            .format('YYYY-MM-DD');
        let edate = moment()
            .month(monthNo)
            .endOf('month')
            .format('YYYY-MM-DD');
        let options = {};
        options.args = {
            sdate: sdate,
            edate: edate
        }; // JSON.parse(options.args);
        options.dbName = query.dbName;
        let ret;
        let sqls = ['get:gstin:startdate:enddate', 'get:gstr1:b2b', 'get:gstr1:b2cs', 'get:gstr1:hsn'];
        let resultSet = {};
        let fns = sqls.map(x => {
            let opts = Object.assign({}, options, {sqlKey: x});
            let fn = (callback) => {
                sqlAny.executeSql(opts, (error, result) => {
                    error
                        ? ret = {
                            error: error
                        }
                        : ret = result;
                    resultSet[x] = ret;
                    callback();
                })
            };
            return (fn);
        });
        async.parallel(fns, function (err, result) {
            let bundle;
            if (err) {
                console.log(err);
                gstr1 = err;
            } else {
                bundle = artifacts.getGstr1(+ monthNo + 1, resultSet);
            }
            if (bundle.invalidGstins && bundle.invalidGstins.length > 0) {
                res.json({'Invalid Gstins' : bundle.invalidGstins});
            } else {
                console.log('invalid GSTN:', bundle.invalidGstins);
                let json = JSON.stringify(bundle.gstr1);
                let monthShortName = moment.monthsShort(+ monthNo);
                let filename = monthShortName.concat('_', bundle.finYear, '_GSTR1_', bundle.gstin, '.json');
                let mimetype = 'application/json';
                res.setHeader('Content-Type', mimetype);
                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.send(json);
            }

        });
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});
module.exports = router;