"use strict";
var messages = {
    errUrlNotFound: 'Url not found',
    errDevError: 'Development error',
    errProdError: 'Production error',
    errUnknown: 'Unknown error',
    errInternalServerError: 'Internal server error',
    errExecution:'Execution error',
    errReqParams:'Request parameters are not in proper format',
    errType:'Request body must contain type parameter. Type can be "web" or "sql"',
    errOptions:'In POST request options object is not present in request body',
    messServerRunning:'Server is running',

};
module.exports = messages;
