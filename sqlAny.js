let fs = require('fs');
let sqlAny = require('sqlanywhere');
let sql = require('./sql');
let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
let messages = require('./messages');
let util = require('util');

let conn = sqlAny.createConnection();
let connParams = {
  EngineName: config.dbServerName,
  CommLinks: 'tcpip',
  UserId: 'DBA',
  Password: 'sql'
};

let createSql = (options) => {  
  let sqlString = sql[options.sqlKey].toLowerCase();
  let args = options.args;
  let argsArray = Object
    .keys(args)
    .map(function (key) {
      return {key: key, value: args[key]};
    });

  sqlString = argsArray.reduce((prev, current) => {
    let regex = new RegExp(':' + current.key.toLowerCase(), 'g');
    prev = prev.replace(regex, util.format("'%s'", current.value));
    return (prev);
  }, sqlString);
  return (sqlString);
}

sqlAny.executeSql = (options, fn) => {
  let isValidOptions = false;
  let result;
  isValidOptions = options.dbName && options.sqlKey && options.args;
  if (!isValidOptions) {
    fn({
      error: messages.errSqlInvalidOptions
    }, result);
    return;
  }
  let sqlString = createSql(options);
  Object.assign(connParams, {DatabaseName: options.dbName});

  if (conn.connected()) {
    conn.close()
  }
  conn
    .connect(connParams, function (err) {
      if (err) {
        fn({
          error: err.message
        }, result)
      } else {
        try {          
          conn.exec(sqlString, (err, result) => {
            conn.disconnect();
            if (err) {
              err = {
                error: err.message
              };
            }
            fn(err, result);
          });
        } catch (error) {
          fn({
            error: error.message
          }, result);
        }
      }
    });
}

module.exports = sqlAny;