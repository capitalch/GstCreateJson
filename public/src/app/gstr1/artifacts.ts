let gstr:any = {};
class B2cs {
    "sply_ty": string = "INTRA";
    "rt": number = 0;
    "typ": string = "OE";
    "pos": string = "19";
    "txval": number = 0;
    "camt": number = 0;
    "samt": number = 0;
}

class Hsn {
    "num": number;
    "hsn_sc": string;
    "desc": string;
    "uqc": string = "PCS";
    "qty": number = 0;
    "val": number = 0.00;
    "txval": number = 0.00;
    "iamt": number = 0.00;
    "samt": number = 0.00;
    "camt": number = 0.00;
}

export function getHsnData(hsnData) {
    let hsnArray = hsnData.map(x => {
        let hsn = new Hsn();
        hsn.num = x.serial_no;
        hsn.hsn_sc = x.hsn;
        hsn.qty = x.total_qty;
        hsn.val = x.total_value;
        hsn.txval = x.taxable_value;
        hsn.iamt = x.igst;
        hsn.samt = x.sgst;
        hsn.camt = x.cgst;
        return (hsn);
    });
    let ret = { data: hsnArray };
    return (ret);
}

export function getB2csArray(b2csData) {
    let b2csArray = b2csData.map(x => {
        let b2cs = new B2cs();
        b2cs.rt = x.rate;
        b2cs.txval = x.taxable_value;
        b2cs.camt = x.taxable_value * x.rate / 200;
        b2cs.samt = x.taxable_value * x.rate / 200;
        return (b2cs);
    });
    return (b2csArray);
}

gstr.getHsnData = getHsnData;
gstr.getB2csArray = getB2csArray;

export var  gstr1:any = gstr;

