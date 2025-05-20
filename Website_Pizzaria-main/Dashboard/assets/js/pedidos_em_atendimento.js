// Função para carregar os pedidos do localStorage
function carregarPedidos() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const tbody = document.getElementById('pedido-body');
    
    if (!tbody) {
        console.error('Elemento tbody não encontrado!');
        return;
    }
    
    tbody.innerHTML = '';

    if (pedidos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" style="text-align: center;">Nenhum pedido encontrado</td>';
        tbody.appendChild(tr);
        return;
    }

    pedidos.forEach((pedido, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.cliente_id}</td>
            <td>${pedido.items.map(item => item.id).join(', ')}</td>
            <td>${pedido.items.reduce((total, item) => total + item.quantity, 0)}</td>
            <td>R$ ${pedido.valor_total.toFixed(2)}</td>
            <td>${pedido.status}</td>
            <td>
                <button onclick="atualizarStatus(${index}, 'Em Preparo')" class="btn-preparo">Em Preparo</button>
                <button onclick="atualizarStatus(${index}, 'Pronto')" class="btn-pronto">Pronto</button>
                <button onclick="finalizarPedido(${index})" class="btn-finalizar">Finalizar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para atualizar o status do pedido
function atualizarStatus(index, novoStatus) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos[index].status = novoStatus;
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    carregarPedidos();
}

// Função para finalizar o pedido
function finalizarPedido(index) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.splice(index, 1);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    carregarPedidos();
}

// Carregar pedidos quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
    const tbody = document.getElementById('pedido-body');
    
    function carregarPedidos() {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        tbody.innerHTML = '';
        
        if (pedidos.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="7" style="text-align: center;">Nenhum pedido encontrado</td>';
            tbody.appendChild(tr);
            return;
        }

        pedidos.forEach(pedido => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.cliente || 'Cliente não informado'}</td>
                <td>${pedido.pizza || 'Pizza não informada'}</td>
                <td>${pedido.quantidade || 1}</td>
                <td>R$ ${pedido.valorTotal || '0.00'}</td>
                <td>${pedido.status || 'Recebido'}</td>
                <td>
                    ${pedido.status === 'Recebido' ? 
                        `<button onclick="atualizarStatus(${pedido.id}, 'Em Preparo')" class="btn-preparo">Em Preparo</button>` : ''}
                    ${pedido.status === 'Em Preparo' ? 
                        `<button onclick="atualizarStatus(${pedido.id}, 'Pronto')" class="btn-pronto">Pronto</button>` : ''}
                    ${pedido.status === 'Pronto' ? 
                        `<button onclick="atualizarStatus(${pedido.id}, 'Saiu Para Entrega')" class="btn-entrega">Entregar</button>` : ''}
                    ${pedido.status !== 'Saiu Para Entrega' ? 
                        `<button onclick="removerPedido(${pedido.id})" class="btn-remover">Remover</button>` : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.atualizarStatus = function(id, novoStatus) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedidoIndex = pedidos.findIndex(p => p.id === id);
        
        if (pedidoIndex !== -1) {
            pedidos[pedidoIndex].status = novoStatus;
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            carregarPedidos();
        }
    };

    window.removerPedido = function(id) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedidosAtualizados = pedidos.filter(pedido => pedido.id !== id);
        localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados));
        carregarPedidos();
    };

    // Função para adicionar novo pedido
    window.adicionarPedido = function(novoPedido) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const ultimoId = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) : 0;
        
        const pedido = {
            id: ultimoId + 1,
            ...novoPedido,
            status: "Recebido"
        };
        
        pedidos.push(pedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        carregarPedidos();
    };

    // Carregar pedidos iniciais
    carregarPedidos();
}); 