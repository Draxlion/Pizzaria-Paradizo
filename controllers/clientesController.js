const db = require('../db');

exports.criarCliente = (req, res) => {
  const { nome, email, senha, telefone, endereco } = req.body;
  
  // Inicia uma transação
  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // Primeiro, insere o cliente
    const queryCliente = 'INSERT INTO clientes (nome, email, senha, telefone) VALUES (?, ?, ?, ?)';
    db.query(queryCliente, [nome, email, senha, telefone], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json(err);
        });
      }

      const clienteId = result.insertId;

      // Se houver endereço, insere na tabela de endereços
      if (endereco) {
        const { rua, numero, bairro, referencia, cidade, estado, cep } = endereco;
        const queryEndereco = 'INSERT INTO enderecos (cliente_id, rua, numero, bairro, referencia, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        
        db.query(queryEndereco, [clienteId, rua, numero, bairro, referencia, cidade, estado, cep], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json(err);
            });
          }

          // Commit da transação
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json(err);
              });
            }
            res.status(201).json({ id: clienteId, nome, email });
          });
        });
      } else {
        // Commit da transação se não houver endereço
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json(err);
            });
          }
          res.status(201).json({ id: clienteId, nome, email });
        });
      }
    });
  });
};

exports.listarClientes = (req, res) => {
  db.query('SELECT c.*, e.* FROM clientes c LEFT JOIN enderecos e ON c.id = e.cliente_id', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.obterCliente = (req, res) => {
  const { id } = req.params;
  db.query('SELECT c.*, e.* FROM clientes c LEFT JOIN enderecos e ON c.id = e.cliente_id WHERE c.id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ msg: 'Cliente não encontrado' });
    res.json(results[0]);
  });
};

exports.buscarCliente = (req, res) => {
  const termo = `%${req.query.q}%`;
  const query = 'SELECT c.*, e.* FROM clientes c LEFT JOIN enderecos e ON c.id = e.cliente_id WHERE c.nome LIKE ? OR c.telefone LIKE ?';
  db.query(query, [termo, termo], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.atualizarCliente = (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, endereco } = req.body;
  
  // Inicia uma transação
  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // Atualiza dados do cliente
    const queryCliente = 'UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?';
    db.query(queryCliente, [nome, email, telefone, id], (err) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json(err);
        });
      }

      // Se houver endereço, atualiza ou insere
      if (endereco) {
        const { rua, numero, bairro, referencia, cidade, estado, cep } = endereco;
        
        // Verifica se já existe endereço
        db.query('SELECT id FROM enderecos WHERE cliente_id = ?', [id], (err, results) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json(err);
            });
          }

          if (results.length > 0) {
            // Atualiza endereço existente
            const queryEndereco = 'UPDATE enderecos SET rua = ?, numero = ?, bairro = ?, referencia = ?, cidade = ?, estado = ?, cep = ? WHERE cliente_id = ?';
            db.query(queryEndereco, [rua, numero, bairro, referencia, cidade, estado, cep, id], (err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json(err);
                });
              }
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json(err);
                  });
                }
                res.json({ msg: 'Cliente e endereço atualizados com sucesso' });
              });
            });
          } else {
            // Insere novo endereço
            const queryEndereco = 'INSERT INTO enderecos (cliente_id, rua, numero, bairro, referencia, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(queryEndereco, [id, rua, numero, bairro, referencia, cidade, estado, cep], (err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json(err);
                });
              }
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json(err);
                  });
                }
                res.json({ msg: 'Cliente e endereço atualizados com sucesso' });
              });
            });
          }
        });
      } else {
        // Commit se não houver endereço para atualizar
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json(err);
            });
          }
          res.json({ msg: 'Cliente atualizado com sucesso' });
        });
      }
    });
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