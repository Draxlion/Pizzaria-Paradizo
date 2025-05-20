const express = require("express");
const router = express.Router();
const cartaoController = require("../controllers/cartaoController");

router.post("/compras", cartaoController.realizarCompra);
router.get("/saldo/:numeroCartao", cartaoController.consultarSaldo);

module.exports = router;
