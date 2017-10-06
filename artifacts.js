function getGstr1(gstinNo, b2bData, b2csData, hsnData) {
    //let b2bData = result.
    let gstr1 = {
        "gstin": gstin,
        "fp": "072017",
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
            "ctin": x.gstin_no,
            "inv": [
                {
                    "inum": x.invoice_no,
                    "idt": x.invoice_date,
                    "val": +x.invoice_value,
                    "pos": "19",
                    "rchrg": "N",
                    "inv_typ": "R",
                    "itms": [
                        {
                            "num": 1,
                            "itm_det": {
                                "txval": +x.taxable_value,
                                "rt": +x.rate,
                                "camt": +x.cgst,
                                "samt": +x.sgst
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
            val: x.total_value,
            txval: x.taxable_value,
            iamt: x.igst,
            samt: x.sgst,
            camt: x.cgst
        });
    });
    let ret = { data: hsnArray };
    return (ret);
}

function getB2csArray(b2csData) {
    let b2csArray = b2csData.map(x => {
        return ({
            rt: +x.rate,
            txval: +x.taxable_value,
            camt: x.taxable_value * x.rate / 200,
            samt: x.taxable_value * x.rate / 200
        });
    });
    return (b2csArray);
}
let artifacts = {};
artifacts.getGstr1 = getGstr1;
module.exports = artifacts;