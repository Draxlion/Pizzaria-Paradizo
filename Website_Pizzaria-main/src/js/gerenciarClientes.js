document.addEventListener('DOMContentLoaded', () => {
    carregarClientes();
    document.getElementById('clienteForm').addEventListener('submit', cadastrarCliente);
});

async function carregarClientes() {
    try {
        const response = await fetch('http://localhost:3000/clientes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const clientes = await response.json();
        exibirClientes(clientes);
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar clientes. Tente novamente.');
    }
}

async function buscarCliente() {
    const searchTerm = document.getElementById('searchInput').value;
    try {
        const response = await fetch(`http://localhost:3000/clientes?search=${searchTerm}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const clientes = await response.json();
        exibirClientes(clientes);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        alert('Erro ao buscar clientes. Tente novamente.');
    }
}

async function cadastrarCliente(event) {
    event.preventDefault();
    
    const cliente = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value
    };

    try {
        const response = await fetch('http://localhost:3000/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Cliente cadastrado com sucesso!');
        document.getElementById('clienteForm').reset();
        carregarClientes();
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        alert('Erro ao cadastrar cliente. Tente novamente.');
    }
}

async function atualizarCliente(id) {
    const cliente = {
        nome: document.getElementById(`nome-${id}`).value,
        email: document.getElementById(`email-${id}`).value,
        telefone: document.getElementById(`telefone-${id}`).value,
        endereco: document.getElementById(`endereco-${id}`).value
    };

    try {
        const response = await fetch(`http://localhost:3000/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        if (response.ok) {
            alert('Cliente atualizado com sucesso!');
            carregarClientes();
        } else {
            throw new Error('Erro ao atualizar cliente');
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente. Tente novamente.');
    }
}

async function desativarCliente(id) {
    if (confirm('Tem certeza que deseja desativar este cliente?')) {
        try {
            const response = await fetch(`http://localhost:3000/clientes/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Cliente desativado com sucesso!');
                carregarClientes();
            } else {
                throw new Error('Erro ao desativar cliente');
            }
        } catch (error) {
            console.error('Erro ao desativar cliente:', error);
            alert('Erro ao desativar cliente. Tente novamente.');
        }
    }
}

function exibirClientes(clientes) {
    const clientesList = document.getElementById('clientesList');
    clientesList.innerHTML = '';

    if (clientes.length === 0) {
        clientesList.innerHTML = '<p>Nenhum cliente encontrado.</p>';
        return;
    }

    clientes.forEach(cliente => {
        const clienteCard = document.createElement('div');
        clienteCard.className = 'client-card';
        clienteCard.innerHTML = `
            <div class="client-info">
                <h3>${cliente.nome}</h3>
                <p><strong>Email:</strong> ${cliente.email}</p>
                <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                <p><strong>Endereço:</strong> ${cliente.endereco}</p>
            </div>
            <div class="client-actions">
                <button onclick="editarCliente(${cliente.id})">Editar</button>
                <button onclick="excluirCliente(${cliente.id})">Excluir</button>
            </div>
        `;
        clientesList.appendChild(clienteCard);
    });
}

async function editarCliente(id) {
    try {
        const response = await fetch(`/api/clientes/${id}`);
        const cliente = await response.json();

        document.getElementById('nome').value = cliente.nome;
        document.getElementById('email').value = cliente.email;
        document.getElementById('telefone').value = cliente.telefone;
        document.getElementById('endereco').value = cliente.endereco;

        const form = document.getElementById('clienteForm');
        let idInput = form.querySelector('input[name="id"]');
        if (!idInput) {
            idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.name = 'id';
            form.appendChild(idInput);
        }
        idInput.value = id;
    } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        alert('Erro ao carregar dados do cliente. Tente novamente.');
    }
}

async function excluirCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        try {
            const response = await fetch(`/api/clientes/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Cliente excluído com sucesso!');
                buscarCliente();
            } else {
                throw new Error('Erro ao excluir cliente');
            }
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            alert('Erro ao excluir cliente. Tente novamente.');
        }
    }
}

document.addEventListener('DOMContentLoaded', buscarCliente); 