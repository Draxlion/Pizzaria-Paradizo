document.addEventListener('DOMContentLoaded', function () {
    const statusColumns = {
        "Recebido": document.getElementById('recebido'),
        "Em Preparo": document.getElementById('preparo'),
        "Pronto": document.getElementById('pronto'),
        "Saiu Para Entrega": document.getElementById('entrega')
    };

    function carregarPedidos() {
        // Limpar todas as colunas
        Object.values(statusColumns).forEach(column => {
            column.innerHTML = '';
        });

        // Buscar pedidos do localStorage
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        
        pedidos.forEach(pedido => {
            const card = criarCardPedido(pedido);
            const coluna = statusColumns[pedido.status] || statusColumns["Recebido"];
            coluna.appendChild(card);
        });
    }

    function criarCardPedido(pedido) {
        const card = document.createElement('div');
        card.className = 'card-pedido';
        card.dataset.id = pedido.id;

        // Garantir valores padrão
        const cliente = pedido.cliente || 'Não informado';
        const pizza = pedido.pizza || 'Não informado';
        const quantidade = pedido.quantidade !== undefined ? pedido.quantidade : 'Não informado';
        const valorTotal = pedido.valorTotal !== undefined ? pedido.valorTotal : 'Não informado';
        const tamanho = pedido.tamanho || 'Não informado';
        const adicionais = pedido.adicionais || 'Não informado';
        const observacoes = pedido.observacoes || '';

        let cardContent = `
            <p><strong>Pedido #${pedido.id}</strong></p>
            <p>Cliente: ${cliente}</p>
            <p>Pizza: ${pizza}</p>
            <p>Tamanho: ${tamanho}</p>
            <p>Quantidade: ${quantidade}</p>
            <p>Valor Total: R$ ${valorTotal}</p>
        `;

        if (adicionais !== 'Não informado') {
            cardContent += `<p>Adicionais: ${adicionais}</p>`;
        }

        if (observacoes) {
            cardContent += `<p>Obs: ${observacoes}</p>`;
        }

        cardContent += `
            <div class="botoes">
                ${pedido.status !== "Saiu Para Entrega" ? 
                    `<button class="botao botao-avancar" onclick="avancarStatus(${pedido.id})">Avançar</button>` : ''}
                ${pedido.status !== "Recebido" ? 
                    `<button class="botao botao-voltar" onclick="voltarStatus(${pedido.id})">Voltar</button>` : ''}
            </div>
        `;

        card.innerHTML = cardContent;
        
        // Adicionar animação de entrada apenas na criação
        setTimeout(() => {
            if (!card.classList.contains('mostrar')) {
                card.classList.add('mostrar');
            }
        }, 10);
        
        return card;
    }

    window.avancarStatus = function(id) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedidoIndex = pedidos.findIndex(p => p.id === id);
        
        if (pedidoIndex !== -1) {
            const pedido = pedidos[pedidoIndex];
            const statusAtual = pedido.status;
            
            // Definir próximo status
            switch(statusAtual) {
                case "Recebido":
                    pedido.status = "Em Preparo";
                    break;
                case "Em Preparo":
                    pedido.status = "Pronto";
                    break;
                case "Pronto":
                    pedido.status = "Saiu Para Entrega";
                    break;
            }
            
            // Atualizar localStorage
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            
            // Recarregar visualização
            carregarPedidos();
        }
    };

    window.voltarStatus = function(id) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedidoIndex = pedidos.findIndex(p => p.id === id);
        
        if (pedidoIndex !== -1) {
            const pedido = pedidos[pedidoIndex];
            const statusAtual = pedido.status;
            
            // Definir status anterior
            switch(statusAtual) {
                case "Em Preparo":
                    pedido.status = "Recebido";
                    break;
                case "Pronto":
                    pedido.status = "Em Preparo";
                    break;
                case "Saiu Para Entrega":
                    pedido.status = "Pronto";
                    break;
            }
            
            // Atualizar localStorage
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            
            // Recarregar visualização
            carregarPedidos();
        }
    };

    // Carregar pedidos iniciais
    carregarPedidos();
});
