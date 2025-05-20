// server.js
const express = require("express");
const cartaoRoutes = require("./routes/cartaoRoutes");
const path = require("path");

const cors = require("cors");
const app = express();
const port = 3000;

const clientesRoutes = require("./routes/clientes");
const pizzasRoutes = require("./routes/pizzas");
const pedidosRoutes = require("./routes/pedidos");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Adicionar headers manualmente para todas as respostas
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "../pizzaria_dashboard-main/pizzaria_dashboard-main")));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Rotas principais
app.use("/clientes", clientesRoutes);
app.use("/pizzas", pizzasRoutes);
app.use("/pedidos", pedidosRoutes);

// Rotas de cartão
console.log("Registrando rotas de cartão...");
app.use("/cartao", cartaoRoutes);

// Rota de teste
app.get("/test", (req, res) => {
  console.log("Rota de teste acessada");
  res.json({ message: "Servidor funcionando!" });
});

// Rota para verificar todas as rotas registradas
app.get("/routes", (req, res) => {
  const routes = app._router.stack
    .filter((r) => r.route)
    .map((r) => ({
      path: r.route.path,
      method: Object.keys(r.route.methods)[0],
    }));
  console.log("Rotas registradas:", routes);
  res.json(routes);
});

// Rotas do Dashboard
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../pizzaria_dashboard-main/pizzaria_dashboard-main/dashboard.html"));
});

app.get("/gerenciar_clientes", (req, res) => {
    res.sendFile(path.join(__dirname, "../pizzaria_dashboard-main/pizzaria_dashboard-main/gerenciar_clientes.html"));
});

app.get("/consultar_pedidos", (req, res) => {
    res.sendFile(path.join(__dirname, "../pizzaria_dashboard-main/pizzaria_dashboard-main/consultar_pedidos.html"));
});

app.get("/catalogo_pizzas", (req, res) => {
    res.sendFile(path.join(__dirname, "../pizzaria_dashboard-main/pizzaria_dashboard-main/catalogo_pizzas.html"));
});

app.get("/catalogo_bebidas", (req, res) => {
    res.sendFile(path.join(__dirname, "../pizzaria_dashboard-main/pizzaria_dashboard-main/catalogo_bebidas.html"));
});

app.get("/pedidos_em_atendimento", (req, res) => {
    res.sendFile(path.join(__dirname, "../pizzaria_dashboard-main/pizzaria_dashboard-main/pedidos_em_atendimento.html"));
});

app.get("/historico_clientes", (req, res) => {
    res.sendFile(path.join(__dirname, "../pizzaria_dashboard-main/pizzaria_dashboard-main/historico_clientes.html"));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// db.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "pizzaria_paradiso",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao banco de dados MySQL");
});

module.exports = connection;

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});
