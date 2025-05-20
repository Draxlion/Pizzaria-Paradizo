function carregarClientes() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const tbody = document.getElementById('clientTableBody');
    tbody.innerHTML = '';
    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.email || ''}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.endereco}</td>
            <td class="status">${cliente.status}</td>
            <td>
                <button class="btn view-orders" onclick="openOrdersModal('${cliente.id}')">Pedidos</button>
                <button class="btn edit" onclick="openEditModal('${cliente.id}')">Editar</button>
                <button class="btn btn-danger" onclick="toggleStatus('${cliente.id}')">${cliente.status === 'Ativo' ? 'Desativar' : 'Ativar'}</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
document.addEventListener('DOMContentLoaded', carregarClientes);

function openOrdersModal(clienteId) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedidosCliente = pedidos.filter(p => p.cliente_id === clienteId);
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    if (pedidosCliente.length === 0) {
        ordersList.innerHTML = '<li>Nenhum pedido encontrado.</li>';
    } else {
        pedidosCliente.forEach(pedido => {
            ordersList.innerHTML += `<li>Pedido #${pedido.id} - ${pedido.items.map(i => i.quantity + 'x ' + i.name).join(', ')} - R$ ${pedido.valor_total.toFixed(2)} - ${pedido.status}</li>`;
        });
    }
    document.getElementById('ordersModal').style.display = 'block';
}

function closeOrdersModal() {
    document.getElementById('ordersModal').style.display = 'none';
}

function toggleStatus(id) {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
        cliente.status = cliente.status === "Ativo" ? "Inativo" : "Ativo";
        localStorage.setItem('clientes', JSON.stringify(clientes));
        carregarClientes();
    }
}

function openEditModal(id) {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;

    document.getElementById("clienteId").value = cliente.id;
    document.getElementById("nome").value = cliente.nome;
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("endereco").value = cliente.endereco;
    document.getElementById("status").value = cliente.status === "Ativo" ? "ativo" : "inativo";

    document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// Salvar alterações do modal de edição
document.getElementById("editForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("clienteId").value;
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(c => c.id === id);

    if (cliente) {
        cliente.nome = document.getElementById("nome").value;
        cliente.telefone = document.getElementById("telefone").value;
        cliente.endereco = document.getElementById("endereco").value;
        cliente.status = document.getElementById("status").value === "ativo" ? "Ativo" : "Inativo";
        localStorage.setItem('clientes', JSON.stringify(clientes));
        carregarClientes();
        closeEditModal();
    }
}); 