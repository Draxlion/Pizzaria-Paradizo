async function carregarPedidos() {
  try {
    const resposta = await fetch('/api/pedidos/atendimento');
    const pedidos = await resposta.json();
    const tbody = document.getElementById('pedido-body');
    tbody.innerHTML = '';

    pedidos.forEach(pedido => {
      const tr = document.createElement('tr');
      tr.dataset.id = pedido.id;
      tr.innerHTML = `
        <td>${pedido.id}</td>
        <td>${pedido.cliente_id}</td>
        <td>${pedido.pizza_id}</td>
        <td>${pedido.quantidade}</td>
        <td>R$ ${pedido.valor_total.toFixed(2)}</td>
        <td><span class="status ${pedido.status.toLowerCase()}">${pedido.status}</span></td>
        <td class="actions">
          ${pedido.status === 'Aguardando' ? `<button class="toPreparando">Preparando</button>` : ''}
          ${pedido.status !== 'Entregue' ? `<button class="toEntregue">Entregue</button>` : ''}
        </td>
      `;
      tbody.appendChild(tr);
    });

    adicionarEventos();
  } catch (erro) {
    console.error('Erro ao carregar pedidos:', erro);
  }
}

function adicionarEventos() {
  document.querySelectorAll('.toPreparando').forEach(botao => {
    botao.addEventListener('click', () => atualizarStatus(botao, 'Preparando'));
  });
  document.querySelectorAll('.toEntregue').forEach(botao => {
    botao.addEventListener('click', () => atualizarStatus(botao, 'Entregue'));
  });
}

async function atualizarStatus(botao, novoStatus) {
  const linha = botao.closest('tr');
  const id = linha.dataset.id;
  try {
    await fetch(`/api/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus })
    });
    carregarPedidos();
  } catch (erro) {
    console.error('Erro ao atualizar status:', erro);
  }
}

window.onload = carregarPedidos;