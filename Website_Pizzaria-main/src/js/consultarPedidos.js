document.addEventListener('DOMContentLoaded', () => {
    carregarPedidos();
});

async function carregarPedidos() {
    try {
        const response = await fetch('http://localhost:3000/pedidos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pedidos = await response.json();
        exibirPedidos(pedidos);
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        alert('Erro ao carregar pedidos. Tente novamente.');
    }
}

async function filtrarPedidos() {
    const status = document.getElementById('statusFilter').value;
    const data = document.getElementById('dataFilter').value;
    
    let url = 'http://localhost:3000/pedidos';
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (data) params.append('data', data);
    
    if (params.toString()) url += `?${params.toString()}`;

    try {
        const response = await fetch(url);
        const pedidos = await response.json();
        exibirPedidos(pedidos);
    } catch (error) {
        console.error('Erro ao filtrar pedidos:', error);
    }
}

async function buscarHistoricoCliente() {
    const termo = document.getElementById('clienteSearch').value;
    try {
        const response = await fetch(`http://localhost:3000/pedidos/cliente/${termo}`);
        const historico = await response.json();
        exibirHistorico(historico);
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
    }
}

// Função para buscar pedidos
async function buscarPedidos() {
    const searchTerm = document.getElementById('searchInput').value;
    try {
        const response = await fetch(`http://localhost:3000/pedidos?search=${searchTerm}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pedidos = await response.json();
        exibirPedidos(pedidos);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        alert('Erro ao buscar pedidos. Tente novamente.');
    }
}

// Função para exibir a lista de pedidos
function exibirPedidos(pedidos) {
    const pedidosList = document.getElementById('pedidosList');
    pedidosList.innerHTML = '';

    if (pedidos.length === 0) {
        pedidosList.innerHTML = '<p>Nenhum pedido encontrado.</p>';
        return;
    }

    pedidos.forEach(pedido => {
        const pedidoCard = document.createElement('div');
        pedidoCard.className = 'order-card';
        pedidoCard.innerHTML = `
            <div class="order-info">
                <h3>Pedido #${pedido.id}</h3>
                <p><strong>Cliente:</strong> ${pedido.cliente.nome}</p>
                <p><strong>Data:</strong> ${new Date(pedido.data).toLocaleString()}</p>
                <p><strong>Status:</strong> <span class="status ${pedido.status.toLowerCase()}">${pedido.status}</span></p>
                <div class="order-items">
                    <h4>Itens do Pedido:</h4>
                    <ul>
                        ${pedido.itens.map(item => `
                            <li>${item.quantidade}x ${item.pizza.nome} - R$ ${item.preco.toFixed(2)}</li>
                        `).join('')}
                    </ul>
                </div>
                <p class="total"><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
            </div>
            <div class="order-actions">
                ${pedido.status === 'AGUARDANDO_PAGAMENTO' ? `
                    <button onclick="atualizarStatusPedido(${pedido.id}, 'EM_PREPARACAO')">Iniciar Preparo</button>
                ` : ''}
                ${pedido.status === 'EM_PREPARACAO' ? `
                    <button onclick="atualizarStatusPedido(${pedido.id}, 'PRONTO')">Marcar como Pronto</button>
                ` : ''}
                ${pedido.status === 'PRONTO' ? `
                    <button onclick="atualizarStatusPedido(${pedido.id}, 'ENTREGUE')">Marcar como Entregue</button>
                ` : ''}
            </div>
        `;
        pedidosList.appendChild(pedidoCard);
    });
}

// Função para atualizar o status do pedido
async function atualizarStatusPedido(id, novoStatus) {
    try {
        const response = await fetch(`/api/pedidos/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        });

        if (response.ok) {
            alert('Status do pedido atualizado com sucesso!');
            buscarPedidos(); // Atualiza a lista
        } else {
            throw new Error('Erro ao atualizar status do pedido');
        }
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        alert('Erro ao atualizar status do pedido. Tente novamente.');
    }
}

function exibirHistorico(historico) {
    const historicoList = document.getElementById('historicoList');
    historicoList.innerHTML = '';

    if (historico.length === 0) {
        historicoList.innerHTML = '<p>Nenhum pedido encontrado para este cliente.</p>';
        return;
    }

    historico.forEach(pedido => {
        const pedidoDiv = document.createElement('div');
        pedidoDiv.className = 'historico-card';
        pedidoDiv.innerHTML = `
            <div class="pedido-info">
                <h3>Pedido #${pedido.id}</h3>
                <p>Data: ${new Date(pedido.data_pedido).toLocaleString()}</p>
                <p>Status: ${formatarStatus(pedido.status)}</p>
                <p>Valor Total: R$ ${pedido.valor_total.toFixed(2)}</p>
            </div>
            <div class="itens-pedido">
                <h4>Itens:</h4>
                <ul>
                    ${pedido.itens.map(item => `
                        <li>${item.quantidade}x ${item.tipo === 'pizza' ? item.pizza.nome : item.bebida.nome}</li>
                    `).join('')}
                </ul>
            </div>
        `;
        historicoList.appendChild(pedidoDiv);
    });
}

function formatarStatus(status) {
    const statusMap = {
        'aguardando_pagamento': 'Aguardando Pagamento',
        'em_preparacao': 'Em Preparação',
        'entregue': 'Entregue'
    };
    return statusMap[status] || status;
}

// Carrega a lista de pedidos ao carregar a página
document.addEventListener('DOMContentLoaded', buscarPedidos); 