// db.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "pizzaria_paradiso",
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);

    process.exit(1);
    return;
  }
  console.log("Conectado ao banco de dados MySQL");
});

module.exports = connection;
