 // routes/pizzas.js
const express = require('express');
const router = express.Router();
const pizzasController = require('../controllers/pizzasController'); 

router.post('/', pizzasController.criarPizza);
router.get('/', pizzasController.listarPizzas);
router.get('/:id', pizzasController.obterPizza);
router.put('/:id', pizzasController.atualizarPizza);
router.delete('/:id', pizzasController.desativarPizza);

module.exports = router;
