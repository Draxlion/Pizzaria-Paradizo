 // controllers/clientesController.js
 const db = require('../db');
 
 exports.criarCliente = (req, res) => {
   const { nome, email, senha, telefone, endereco } = req.body;
   const query = 'INSERT INTO clientes (nome, email, senha, telefone, endereco) VALUES (?, ?, ?, ?, ?)';
   db.query(query, [nome, email, senha, telefone, endereco], (err, result) => {
     if (err) return res.status(500).json(err);
     res.status(201).json({ id: result.insertId, nome, email });
   });
 };
 
 exports.listarClientes = (req, res) => {
   db.query('SELECT * FROM clientes', (err, results) => {
     if (err) return res.status(500).json(err);
     res.json(results);
   });
 };
 
 exports.obterCliente = (req, res) => {
   const { id } = req.params;
   db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, results) => {
     if (err) return res.status(500).json(err);
     if (results.length === 0) return res.status(404).json({ msg: 'Cliente não encontrado' });
     res.json(results[0]);
   });
 };
 
 exports.buscarCliente = (req, res) => {
   const termo = `%${req.query.q}%`;
   const query = 'SELECT * FROM clientes WHERE nome LIKE ? OR telefone LIKE ?';
   db.query(query, [termo, termo], (err, results) => {
     if (err) return res.status(500).json(err);
     res.json(results);
   });
 };
 
 exports.atualizarCliente = (req, res) => {
   const { id } = req.params;
   const { nome, email, telefone, endereco } = req.body;
   const query = 'UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?';
   db.query(query, [nome, email, telefone, endereco, id], (err) => {
     if (err) return res.status(500).json(err);
     res.json({ msg: 'Cliente atualizado com sucesso' });
   });
 };
 
 exports.desativarCliente = (req, res) => {
   const { id } = req.params;
   const query = 'UPDATE clientes SET status = "inativo" WHERE id = ?';
   db.query(query, [id], (err) => {
     if (err) return res.status(500).json(err);
     res.json({ msg: 'Cliente desativado com sucesso' });
   });
 };
