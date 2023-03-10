var mysql = require("mysql");
var db_config = {
  host: "10.0.1.3",
  port: "6033",
  user: "root",
  password: "my_secret_password",
  database: "missmister",
  multipleStatements: true,
  typeCast: function (field, next) {
      if (field.type == 'VAR_STRING') {
          return field.string();
      }
      return next();
  }
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } else {
      console.log("connected to db");
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();

setInterval(keepalive, 180000); // 30 mins

function keepalive() {
  connection.query("SELECT 1");
}

module.exports = connection;
module.exports.config = db_config;
