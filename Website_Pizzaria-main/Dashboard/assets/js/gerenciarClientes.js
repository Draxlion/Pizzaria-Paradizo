// Lista de clientes em memória
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let pedidosExemplo = {
  // Apenas exemplo de pedidos simulados
  "1": [
    "Pedido #001 - 2x Calabresa - R$ 90,00 - Entregue",
    "Pedido #002 - 1x Marguerita - R$ 63,00 - Em preparo"
  ]
};

// Atualizar tabela ao abrir a página
atualizarTabela();

// Cadastro de cliente
document.getElementById("clienteForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const endereco = document.getElementById("endereco").value;

  let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const novoCliente = {
    id: 'CLIENTE_' + Date.now(),
    nome,
    email,
    telefone,
    endereco,
    status: 'Ativo'
  };
  clientes.push(novoCliente);
  localStorage.setItem('clientes', JSON.stringify(clientes));

  // Limpar formulário
  document.getElementById("clienteForm").reset();

  // Atualizar lista em memória e tabela
  window.clientes = clientes;
  atualizarTabela();
});

// Buscar cliente
function buscarCliente() {
  const termo = document.getElementById("searchInput").value.toLowerCase();
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(termo) || c.telefone.includes(termo)
  );
  atualizarTabela(filtrados);
}

// Atualizar tabela
function atualizarTabela(lista = clientes) {
  const tbody = document.getElementById("clientesList");
  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>Nenhum cliente encontrado.</td></tr>";
    return;
  }

  lista.forEach(cliente => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.email}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.endereco}</td>
      <td class="status ${cliente.status}">${cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}</td>
      <td>
        <button class="btn view-orders" onclick="openOrdersModal('${cliente.id}')">Pedidos</button>
        <button class="btn edit" onclick="openEditModal('${cliente.id}')">Editar</button>
        <button class="btn btn-danger" onclick="toggleStatus('${cliente.id}')">${cliente.status === 'ativo' ? 'Desativar' : 'Ativar'}</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Alternar status (Ativar/Desativar)
function toggleStatus(id) {
  const cliente = clientes.find(c => c.id === id);
  if (cliente) {
    cliente.status = cliente.status === "ativo" ? "inativo" : "ativo";
    atualizarTabela();
  }
}

// Modal: Visualizar pedidos
function openOrdersModal(id) {
  const ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = "";

  const pedidos = pedidosExemplo[id] || ["Nenhum pedido encontrado."];

  pedidos.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    ordersList.appendChild(li);
  });

  document.getElementById("ordersModal").style.display = "block";
}

function closeOrdersModal() {
  document.getElementById("ordersModal").style.display = "none";
}

// Modal: Editar cliente
function openEditModal(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;

  document.getElementById("clienteId").value = cliente.id;
  document.getElementById("editNome").value = cliente.nome;
  document.getElementById("editEmail").value = cliente.email;
  document.getElementById("editTelefone").value = cliente.telefone;
  document.getElementById("editEndereco").value = cliente.endereco;
  document.getElementById("editStatus").value = cliente.status;

  document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

// Salvar alterações do modal de edição
document.getElementById("editForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const id = document.getElementById("clienteId").value;
  const cliente = clientes.find(c => c.id === id);

  if (cliente) {
    cliente.nome = document.getElementById("editNome").value;
    cliente.email = document.getElementById("editEmail").value;
    cliente.telefone = document.getElementById("editTelefone").value;
    cliente.endereco = document.getElementById("editEndereco").value;
    cliente.status = document.getElementById("editStatus").value;

    atualizarTabela();
    closeEditModal();
  }
});

// Fechar modais com clique fora
window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    closeOrdersModal();
    closeEditModal();
  }
};
