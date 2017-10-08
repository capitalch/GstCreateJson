export const urlMaps = {
    'post:gstr1:json': 'http://localhost:3005/api/gstr1/json',
    'get:gstr1:json': 'http://localhost:3005/api/gstr1/json',
    'post:gstin': 'http://localhost:3005/api/gstr1',
    'post:gstr1:reg:sale': 'http://localhost:3005/api/gstr1',
    'post:gstr1:unreg:sale': 'http://localhost:3005/api/gstr1',
    'post:gstr1:hsn:sale': 'http://localhost:3005/api/gstr1',
    'post:acc': 'select acc_id from acc_main',
    'post:bill': 'select bill_memo_id from bill_memo'
};
export const AllDbNames = ['capi2017', 'capi2018', 'ele2017', 'techservice2017'];
export const DefaultSettings = {
    'default:return:month:from:current:month': 3
};
export const AllMonths = [
    {
        name: 'April',
        value: 3
    }, {
        name: 'May',
        value: 4
    }, {
        name: 'June',
        value: 5
    }, {
        name: 'July',
        value: 6
    }, {
        name: 'August',
        value: 7
    }, {
        name: 'September',
        value: 8
    }, {
        name: 'October',
        value: 9
    }, {
        name: 'November',
        value: 10
    }, {
        name: 'December',
        value: 11
    }, {
        name: 'January',
        value: 0
    }, {
        name: 'February',
        value: 1
    }, {
        name: 'March',
        value: 2
    }

];