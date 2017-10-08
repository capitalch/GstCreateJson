let moment = require('moment');
function getGstr1(monthNo, resultSet) {
    // gstinNo, b2bData, b2csData, hsnData
    let setup = resultSet['get:gstin:startdate:enddate'][0];
    let gstin = setup.gstin && setup.gstin.toUpperCase();
    let finStartDate = setup.startdate;
    let finEndDate = setup.enddate;
    let finStartYear = moment(finStartDate, 'YYYY-MM-DD').year();
    let finEndYear = moment(finEndDate, 'YYYY-MM-DD').year();
    let returnPeriod = () => {
        // let monthNo = "9"; let nMonthNo = +monthNo;
        let padding = monthNo < 10
            ? "0"
            : "";
        let pMonthNo = padding + monthNo;
        let pYear = monthNo > 3
            ? finStartYear
            : finEndYear;
        return(pMonthNo) + pYear;
    };
    let b2bData = resultSet['get:gstr1:b2b'];
    let b2csData = resultSet['get:gstr1:b2cs'];
    let hsnData = resultSet['get:gstr1:hsn'];
    //let b2bData = result.
    let gstr1 = {
        "gstin": gstin,
        "fp": returnPeriod(),
        "gt": 0,
        "cur_gt": 0,
        "version": "GST1.2.1",
        "hash": "hash",
        "b2b": getB2bArray(b2bData),
        "b2cs": getB2csArray(b2csData),
        "hsn": getHsnData(hsnData)
    };
    return (gstr1);
}

function getB2bArray(b2bData) {
    let b2bArray = b2bData.map(x => {
        return ({
            "ctin": x.gstin_no.toUpperCase(),
            "inv": [
                {
                    "inum": x.invoice_no,
                    "idt": moment(x.invoice_date,'YYYY-MM-DD').format('DD-MM-YYYY'),
                    "val": + x.invoice_value,
                    "pos": "19",
                    "rchrg": "N",
                    "inv_typ": "R",
                    "itms": [
                        {
                            "num": 1,
                            "itm_det": {
                                "txval": + x.taxable_value,
                                "rt": + x.rate,
                                "camt": + x.cgst,
                                "samt": + x.sgst
                            }
                        }
                    ]
                }
            ]
        });
    });
    return (b2bArray);
}

function getHsnData(hsnData) {
    let hsnArray = hsnData.map(x => {
        return ({
            num: x.serial_no,
            hsn_sc: x.hsn,
            qty: x.total_qty,
            val: + (+ x.total_value).toFixed(2),
            txval: + (+ x.taxable_value).toFixed(2),
            iamt: + (+ x.igst).toFixed(2),
            samt: + (+ x.sgst).toFixed(2),
            camt: + (+ x.cgst).toFixed(2)
        });
    });
    let ret = {
        data: hsnArray
    };
    return (ret);
}

function getB2csArray(b2csData) {
    let b2csArray = b2csData.map(x => {
        return ({
            rt: + x.rate,
            txval: + x.taxable_value,
            camt: + (x.taxable_value * (x.rate / 200)).toFixed(2),
            samt: + (x.taxable_value * (x.rate / 200)).toFixed(2)
        });
    });
    return (b2csArray);
}
let artifacts = {};
artifacts.getGstr1 = getGstr1;
module.exports = artifacts;