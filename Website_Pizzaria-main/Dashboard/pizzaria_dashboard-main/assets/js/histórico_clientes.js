async function buscarCliente() {
  const termo = document.getElementById("searchInput").value.toLowerCase();
  const linhas = document.querySelectorAll("#clientTableBody tr");
  linhas.forEach(linha => {
    const nome = linha.cells[0].innerText.toLowerCase();
    const telefone = linha.cells[1].innerText.toLowerCase();
    linha.style.display = nome.includes(termo) || telefone.includes(termo) ? '' : 'none';
  });
}

async function carregarClientesDoBackend() {
  try {
    const resposta = await fetch('/api/clientes');
    const clientes = await resposta.json();
    const tbody = document.getElementById('clientTableBody');

    clientes.forEach(cliente => {
      const tr = document.createElement('tr');
      tr.dataset.id = cliente.id;
      tr.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.telefone}</td>
        <td>${cliente.endereco}</td>
        <td class="status">${cliente.status}</td>
        <td>
          <button class="btn view-orders" onclick="openOrdersModal()">Pedidos</button>
          <button class="btn edit" onclick="openEditModal(this)">Editar</button>
          <button class="btn ${cliente.status === 'Ativo' ? 'btn-danger' : 'btn-success'}" onclick="toggleStatus(this)">${cliente.status === 'Ativo' ? 'Desativar' : 'Ativar'}</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
  }
}

function openOrdersModal() {
  document.getElementById("ordersModal").style.display = "block";
}
function closeOrdersModal() {
  document.getElementById("ordersModal").style.display = "none";
}
function openEditModal(button) {
  const row = button.closest('tr');
  document.getElementById('clienteId').value = row.dataset.id;
  document.getElementById('nome').value = row.cells[0].innerText;
  document.getElementById('telefone').value = row.cells[1].innerText;
  document.getElementById('endereco').value = row.cells[2].innerText;
  document.getElementById('status').value = row.cells[3].innerText.toLowerCase();
  document.getElementById('editModal').style.display = 'flex';
}
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}
window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
}
document.getElementById("editForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const id = document.getElementById("clienteId").value;
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const endereco = document.getElementById("endereco").value;
  const status = document.getElementById("status").value;

  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    row.cells[0].innerText = nome;
    row.cells[1].innerText = telefone;
    row.cells[2].innerText = endereco;
    row.cells[3].innerText = status.charAt(0).toUpperCase() + status.slice(1);
  }

  // Opcional: enviar para o backend com fetch('/api/clientes/'+id, { method: 'PUT', ... })
  closeEditModal();
});

function toggleStatus(button) {
  const row = button.closest("tr");
  const statusCell = row.querySelector(".status");
  if (statusCell.innerText === "Ativo") {
    statusCell.innerText = "Inativo";
    button.innerText = "Ativar";
    button.classList.remove("btn-danger");
    button.classList.add("btn-success");
  } else {
    statusCell.innerText = "Ativo";
    button.innerText = "Desativar";
    button.classList.remove("btn-success");
    button.classList.add("btn-danger");
  }
}

window.onload = carregarClientesDoBackend;