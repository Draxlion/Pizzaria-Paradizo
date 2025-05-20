const db = require('../db');

exports.criarPedido = (req, res) => {
  const { cliente_id, itens, forma_pagamento } = req.body;

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ msg: 'Carrinho vazio' });
  }

  const data_pedido = new Date();
  const status = 'Aguardando pagamento';

  let valor_total = 0;
  let query = 'INSERT INTO pedidos (cliente_id, forma_pagamento, status, data_pedido, valor_total) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [cliente_id, forma_pagamento, status, data_pedido, valor_total], (err, result) => {
    if (err) return res.status(500).json(err);

    const pedido_id = result.insertId;
    let insertItens = 'INSERT INTO itens_pedido (pedido_id, tipo, item_id, quantidade, preco_unitario, tamanho, adicionais, observacoes) VALUES ?';

    let values = itens.map(item => {
      valor_total += item.preco * item.quantidade;
      return [
        pedido_id,
        item.tipo,
        item.item_id,
        item.quantidade,
        item.preco,
        item.tamanho || null,
        item.adicionais || null,
        item.observacoes || null
      ];
    });

    db.query(insertItens, [values], (err2) => {
      if (err2) return res.status(500).json(err2);

      db.query('UPDATE pedidos SET valor_total = ? WHERE id = ?', [valor_total, pedido_id]);

      res.status(201).json({ pedido_id, valor_total });
    });
  });
};

exports.listarPedidos = (req, res) => {
  db.query('SELECT * FROM pedidos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.pedidosEmAtendimento = (req, res) => {
  db.query('SELECT * FROM pedidos WHERE status = "Pago" OR status = "Preparando"', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.pedidosEntregues = (req, res) => {
  db.query('SELECT * FROM pedidos WHERE status = "Entregue"', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.historicoCliente = (req, res) => {
  const { clienteId } = req.params;
  db.query('SELECT * FROM pedidos WHERE cliente_id = ?', [clienteId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.atualizarStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const statusValidos = ['Aguardando pagamento', 'Pago', 'Preparando', 'Entregue'];
  
  if (!statusValidos.includes(status)) {
    return res.status(400).json({ msg: 'Status inválido' });
  }

  db.query('UPDATE pedidos SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: 'Status atualizado com sucesso' });
  });
}; 