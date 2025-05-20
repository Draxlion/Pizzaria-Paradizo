const cartoes = require("../services/cartoesFakeDB");

function aprovarCompra(cartao, valor, tipoPagamento) {
  console.log('Verificando compra:', { cartao, valor, tipoPagamento });
  
  // Verifica se o tipo de cartão corresponde ao tipo de pagamento
  if (cartao.tipo !== tipoPagamento) {
    console.log('Tipo de cartão não corresponde ao tipo de pagamento:', {
      cartaoTipo: cartao.tipo,
      pagamentoTipo: tipoPagamento
    });
    return false;
  }

  // Para VR e Débito, verifica apenas se tem saldo suficiente
  if (tipoPagamento === 'vr' || tipoPagamento === 'debito') {
    if (cartao.saldo >= valor) {
      cartao.saldo -= valor;
      return true;
    }
    return false;
  }
  
  // Para crédito, verifica se o saldo + valor não excede o limite
  if (cartao.saldo + valor <= cartao.limite) {
    cartao.saldo += valor;
    return true;
  }
  
  return false;
}

exports.realizarCompra = (req, res) => {
  try {
    console.log('Recebendo requisição de compra:', req.body);
    console.log('Headers:', req.headers);
    
    const { numeroCartao, valor, tipoPagamento } = req.body;
    
    if (!numeroCartao || !valor || !tipoPagamento) {
      console.log('Dados incompletos:', { numeroCartao, valor, tipoPagamento });
      return res.status(400).json({ mensagem: "Dados incompletos" });
    }

    // Remover hífens e espaços do número do cartão
    const numeroCartaoLimpo = numeroCartao.replace(/[-\s]/g, '');
    console.log('Número do cartão limpo:', numeroCartaoLimpo);

    // Formatar o número do cartão com hífens para comparação
    const numeroCartaoFormatado = numeroCartaoLimpo.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
    console.log('Número do cartão formatado:', numeroCartaoFormatado);

    // Listar todos os cartões disponíveis
    console.log('Cartões disponíveis:', cartoes);

    const cartao = cartoes.find((c) => {
      console.log('Comparando:', {
        cartaoDB: c.numero,
        numeroRecebido: numeroCartaoFormatado,
        igual: c.numero === numeroCartaoFormatado
      });
      return c.numero === numeroCartaoFormatado;
    });
    
    console.log('Cartão encontrado:', cartao);
    
    if (!cartao) {
      console.log('Cartão não encontrado:', numeroCartaoFormatado);
      return res.status(404).json({ mensagem: "Cartão não encontrado" });
    }

    // Verificar o tipo de pagamento antes de aprovar a compra
    if (cartao.tipo !== tipoPagamento) {
      console.log('Tipo de cartão não corresponde ao tipo de pagamento:', {
        cartaoTipo: cartao.tipo,
        pagamentoTipo: tipoPagamento
      });
      return res.status(403).json({ mensagem: "Tipo de cartão não corresponde ao tipo de pagamento" });
    }

    if (aprovarCompra(cartao, valor, tipoPagamento)) {
      console.log('Compra aprovada:', { valor, saldo: cartao.saldo });
      return res.json({ mensagem: "Compra aprovada", valor, saldo: cartao.saldo });
    } else {
      console.log('Saldo insuficiente:', { valor, saldo: cartao.saldo });
      return res.status(402).json({ mensagem: "Saldo insuficiente" });
    }
  } catch (error) {
    console.error('Erro ao processar compra:', error);
    console.error('Stack trace:', error.stack);
    return res.status(500).json({ mensagem: "Erro interno do servidor", erro: error.message });
  }
};

exports.consultarSaldo = (req, res) => {
  try {
    const { numeroCartao } = req.params;
    console.log('Consultando saldo do cartão:', numeroCartao);
    
    const cartao = cartoes.find((c) => c.numero === numeroCartao);
    if (!cartao) {
      return res.status(404).json({ mensagem: "Cartão não encontrado" });
    }
    return res.json({ saldo: cartao.saldo, limite: cartao.limite });
  } catch (error) {
    console.error('Erro ao consultar saldo:', error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
