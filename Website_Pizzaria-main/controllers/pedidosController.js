// controllers/pedidosController.js
const db = require('../db');

// Função auxiliar para converter data para o formato do MySQL
function formatDate(date) {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

exports.criarPedido = (req, res) => {
    // Extrair dados do corpo da requisição
    const { cliente_id, itens, forma_pagamento, valor_total, status: statusRecebido } = req.body;
    console.log('Dados recebidos no servidor:', req.body);

    // Validações básicas
    if (!Array.isArray(itens) || itens.length === 0) {
        console.error('Erro: Carrinho vazio');
        return res.status(400).json({ 
            success: false, 
            msg: 'Carrinho vazio. Adicione itens antes de finalizar o pedido.' 
        });
    }

    if (!cliente_id) {
        console.error('Erro: ID do cliente não fornecido');
        return res.status(400).json({ 
            success: false, 
            msg: 'ID do cliente não fornecido' 
        });
    }

    const data_pedido = formatDate(new Date());
    // Usar o status enviado pelo frontend, ou 'Aguardando pagamento' se não vier
    const status = statusRecebido || 'Aguardando pagamento';
    // Mapear para os valores permitidos no ENUM: 'credito', 'debito', 'vr'
    let forma_pagamento_formatada = 'credito';
    if (forma_pagamento === 'credito') forma_pagamento_formatada = 'credito';
    else if (forma_pagamento === 'debito') forma_pagamento_formatada = 'debito';
    else if (forma_pagamento === 'vr') forma_pagamento_formatada = 'vr';
    else forma_pagamento_formatada = 'credito'; // padrão

    console.log('Iniciando transação para o pedido do cliente:', cliente_id);

    // Iniciar transação
    db.beginTransaction((err) => {
        if (err) {
            console.error('Erro ao iniciar transação:', err);
            return res.status(500).json({ 
                success: false, 
                msg: 'Erro ao processar pedido. Tente novamente mais tarde.' 
            });
        }

        console.log('Transação iniciada com sucesso');

        // 1. Inserir o pedido na tabela de pedidos
        const queryPedido = `
            INSERT INTO pedidos 
            (cliente_id, forma_pagamento, status, data_pedido, valor_total) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        console.log('Executando query para inserir pedido:', queryPedido, [
            cliente_id, 
            forma_pagamento_formatada, 
            status, 
            data_pedido, 
            valor_total
        ]);

        db.query(queryPedido, 
            [cliente_id, forma_pagamento_formatada, status, data_pedido, valor_total], 
            (err, result) => {
                if (err) {
                    console.error('Erro ao inserir pedido:', err);
                    return db.rollback(() => {
                        res.status(500).json({ 
                            success: false, 
                            msg: 'Erro ao salvar pedido',
                            error: err.message
                        });
                    });
                }


                const pedido_id = result.insertId;
                console.log('Pedido inserido com ID:', pedido_id);

                // 2. Inserir itens do pedido na tabela itens_pedido
                if (itens && itens.length > 0) {
                    const valoresItens = itens.map(item => {
                        // Converter adicionais para string JSON se for um array
                        const adicionais = Array.isArray(item.adicionais) ? 
                                         JSON.stringify(item.adicionais) : 
                                         (item.adicionais || '[]');
                        
                        return [
                            pedido_id,
                            item.tipo || 'pizza',
                            item.item_id || 0,
                            item.quantidade || 1,
                            item.preco || 0,
                            item.tamanho || 'grande',
                            adicionais,
                            item.observacoes || ''
                        ];
                    });

                    console.log('Preparando para inserir itens do pedido:', valoresItens);

                    const queryItens = `
                        INSERT INTO itens_pedido 
                        (pedido_id, tipo, item_id, quantidade, preco_unitario, tamanho, adicionais, observacoes) 
                        VALUES ?
                    `;

                    db.query(queryItens, [valoresItens], (err, result) => {
                        if (err) {
                            console.error('Erro ao inserir itens do pedido:', err);
                            return db.rollback(() => {
                                res.status(500).json({ 
                                    success: false, 
                                    msg: 'Erro ao salvar itens do pedido',
                                    error: err.message
                                });
                            });
                        }


                        console.log('Itens do pedido inseridos com sucesso');

                        // Se chegou até aqui, confirma a transação
                        db.commit((err) => {
                            if (err) {
                                console.error('Erro ao confirmar transação:', err);
                                return db.rollback(() => {
                                    res.status(500).json({ 
                                        success: false, 
                                        msg: 'Erro ao finalizar pedido',
                                        error: err.message
                                    });
                                });
                            }


                            console.log('Pedido finalizado com sucesso. ID:', pedido_id);
                            res.status(201).json({ 
                                success: true, 
                                pedido_id, 
                                valor_total,
                                msg: 'Pedido criado com sucesso' 
                            });
                        });
                    });
                } else {
                    // Se não houver itens, apenas confirma a transação
                    db.commit((err) => {
                        if (err) {
                            console.error('Erro ao confirmar transação:', err);
                            return db.rollback(() => {
                                res.status(500).json({ 
                                    success: false, 
                                    msg: 'Erro ao finalizar pedido',
                                    error: err.message
                                });
                            });
                        }


                        console.log('Pedido finalizado sem itens. ID:', pedido_id);
                        res.status(201).json({ 
                            success: true, 
                            pedido_id, 
                            valor_total: 0,
                            msg: 'Pedido criado sem itens' 
                        });
                    });
                }
            }
        );
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
   db.query('UPDATE pedidos SET status = ? WHERE id = ?', [status, id], (err) => {
     if (err) return res.status(500).json(err);
     res.json({ msg: 'Status atualizado com sucesso' });
   });
 };
