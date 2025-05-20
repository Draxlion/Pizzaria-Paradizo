// controllers/pizzasController.js
const db = require('../db'); // Certifique-se que db.js está no diretório pai, ex: ../db.js

exports.criarPizza = (req, res) => {
  const { nome, descricao, preco, imagem } = req.body;
  // Define o status como 'ativo' por padrão ao criar
  const query = 'INSERT INTO pizzas (nome, descricao, preco, imagem, status) VALUES (?, ?, ?, ?, "ativo")';
  db.query(query, [nome, descricao, preco, imagem], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, nome });
  });
};

exports.listarPizzas = (req, res) => {
  // Lista apenas pizzas ativas por padrão
  db.query('SELECT * FROM pizzas WHERE status = "ativo"', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.obterPizza = (req, res) => {
  const { id } = req.params;
  // Pode fazer sentido buscar uma pizza mesmo inativa pelo ID direto
  db.query('SELECT * FROM pizzas WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ msg: 'Pizza não encontrada' });
    res.json(results[0]);
  });
};

exports.atualizarPizza = (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, imagem } = req.body;
  // Não atualiza o status aqui, use a rota de desativar se necessário
  const query = 'UPDATE pizzas SET nome = ?, descricao = ?, preco = ?, imagem = ? WHERE id = ?';
  db.query(query, [nome, descricao, preco, imagem, id], (err, result) => { // Adicionado 'result'
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ msg: 'Pizza não encontrada para atualização' });
    res.json({ msg: 'Pizza atualizada com sucesso' });
  });
};

exports.desativarPizza = (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE pizzas SET status = "inativo" WHERE id = ?';
  db.query(query, [id], (err, result) => { // Adicionado 'result'
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ msg: 'Pizza não encontrada para desativação' });
    res.json({ msg: 'Pizza desativada com sucesso' });
  });
}; 
