 // routes/pedidos.js
const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController'); 

router.post('/', pedidosController.criarPedido);
router.get('/', pedidosController.listarPedidos);
router.get('/cliente/:clienteId', pedidosController.historicoCliente);
router.get('/atendimento', pedidosController.pedidosEmAtendimento);
router.get('/entregues', pedidosController.pedidosEntregues);
router.put('/:id/status', pedidosController.atualizarStatus);

module.exports = router;
