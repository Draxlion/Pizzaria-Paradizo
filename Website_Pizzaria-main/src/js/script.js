// Funções de Modal
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('active');
    }
}

// Event Listeners para Modais
document.addEventListener('DOMContentLoaded', function() {
    // Botão Novo Produto
    const btnNewProduct = document.getElementById('btnNewProduct');
    if (btnNewProduct) {
        btnNewProduct.addEventListener('click', () => toggleModal('newProductModal'));
    }

    // Botão Novo Cliente
    const btnNewCustomer = document.getElementById('btnNewCustomer');
    if (btnNewCustomer) {
        btnNewCustomer.addEventListener('click', () => toggleModal('newCustomerModal'));
    }

    // Botões de Cancelar
    const cancelButtons = document.querySelectorAll('#btnCancel');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Fechar Modal ao clicar fora
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});

// Validação de Formulários
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                console.log('Formulário válido, enviando dados...');
                form.reset();
                const modal = form.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            }
        });
    });
});

// Funções de Formatação
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

// Funções de Filtro
function filterTable(tableId, searchTerm) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if (cell.textContent.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                found = true;
                break;
            }
        }
        
        row.style.display = found ? '' : 'none';
    }
}

// Event Listeners para Filtros
document.addEventListener('DOMContentLoaded', function() {
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Buscar"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('keyup', function() {
            const table = this.closest('.filters').nextElementSibling;
            if (table && table.tagName === 'TABLE') {
                filterTable(table.id, this.value);
            }
        });
    });

    // Botão Filtrar
    const filterButtons = document.querySelectorAll('.btn-secondary');
    filterButtons.forEach(button => {
        if (button.textContent.includes('Filtrar')) {
            button.addEventListener('click', function() {
                const filters = this.closest('.filters');
                const searchInput = filters.querySelector('input[type="text"]');
                const table = filters.nextElementSibling;
                
                if (searchInput && table && table.tagName === 'TABLE') {
                    filterTable(table.id, searchInput.value);
                }
            });
        }
    });
});

// Funções de Paginação
document.addEventListener('DOMContentLoaded', function() {
    const paginationButtons = document.querySelectorAll('.pagination button');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentPage = document.querySelector('.pagination span');
            if (currentPage) {
                const currentPageNumber = parseInt(currentPage.textContent.match(/\d+/)[0]);
                const totalPages = parseInt(currentPage.textContent.match(/de (\d+)/)[1]);
                
                if (this.textContent.includes('Próxima') && currentPageNumber < totalPages) {
                    currentPage.textContent = `Página ${currentPageNumber + 1} de ${totalPages}`;
                } else if (this.textContent.includes('Anterior') && currentPageNumber > 1) {
                    currentPage.textContent = `Página ${currentPageNumber - 1} de ${totalPages}`;
                }
            }
        });
    });
});

// Funções de Exportação
function exportReport(format) {
    console.log(`Exportando relatório no formato ${format}...`);
}

document.addEventListener('DOMContentLoaded', function() {
    const exportButtons = document.querySelectorAll('.export-options button');
    
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.textContent.toLowerCase().includes('pdf') ? 'pdf' : 'excel';
            exportReport(format);
        });
    });
});

// Funções de Status de Pedido
function updateOrderStatus(orderId, newStatus) {
    console.log(`Atualizando status do pedido ${orderId} para ${newStatus}...`);
}

document.addEventListener('DOMContentLoaded', function() {
    const statusButtons = document.querySelectorAll('.status');
    
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.closest('tr').querySelector('td:first-child').textContent;
            const currentStatus = this.textContent.trim();
            updateOrderStatus(orderId, currentStatus);
        });
    });
});

// Função para salvar cliente
function saveCustomer(customerData) {
    // Aqui você pode implementar a lógica para salvar no backend
    // Por enquanto, vamos apenas adicionar à tabela
    const table = document.getElementById('customersTable');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${customerData.name}</td>
        <td>${customerData.email}</td>
        <td>${customerData.phone}</td>
        <td>${customerData.address}</td>
        <td>0</td>
        <td>
            <button class="btn-edit" data-customer-id="${Date.now()}">Editar</button>
            <button class="btn-details" data-customer-id="${Date.now()}">Detalhes</button>
        </td>
    `;

    tbody.insertBefore(newRow, tbody.firstChild);
}

// Atualizar o evento de submit do formulário de cliente
document.addEventListener('DOMContentLoaded', function() {
    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = this.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                const customerData = {
                    name: document.getElementById('customerName').value,
                    email: document.getElementById('customerEmail').value,
                    phone: document.getElementById('customerPhone').value,
                    address: document.getElementById('customerAddress').value
                };

                saveCustomer(customerData);
                
                // Limpar formulário e fechar modal
                this.reset();
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }

                // Mostrar mensagem de sucesso
                alert('Cliente cadastrado com sucesso!');
            }
        });
    }
}); 