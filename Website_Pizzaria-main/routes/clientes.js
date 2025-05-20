 // routes/clientes.js
const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController'); // Garanta que o controller está em ../controllers/

router.post('/', clientesController.criarCliente);
router.get('/', clientesController.listarClientes);
router.get('/search', clientesController.buscarCliente); // Rota de busca
router.get('/:id', clientesController.obterCliente);
router.put('/:id', clientesController.atualizarCliente);
router.delete('/:id', clientesController.desativarCliente);

module.exports = router;
