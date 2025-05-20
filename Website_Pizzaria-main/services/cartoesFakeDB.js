const cartoes = [
  { id: 1, numero: "1234-5678-9012-3456", saldo: 1000, limite: 2000, tipo: "credito" },
  { id: 2, numero: "9876-5432-1098-7654", saldo: 500, limite: 1500, tipo: "credito" },
  { id: 3, numero: "1111-2222-3333-4444", saldo: 800, limite: 800, tipo: "vr" },
  { id: 4, numero: "5555-6666-7777-8888", saldo: 1200, limite: 1200, tipo: "debito" }
];

// Função para formatar o número do cartão
function formatarNumeroCartao(numero) {
  // Primeiro remove todos os caracteres não numéricos
  const numeros = numero.replace(/\D/g, '');
  // Depois formata com hífens
  return numeros.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
}

// Garantir que todos os números de cartão estejam formatados
cartoes.forEach(cartao => {
  cartao.numero = formatarNumeroCartao(cartao.numero);
  console.log(`Cartão ${cartao.id} formatado:`, cartao.numero);
});

module.exports = cartoes;
