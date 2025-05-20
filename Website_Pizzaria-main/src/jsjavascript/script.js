// Meninos, vou adicionar comentários pra nos ajudar a entender o que to fazendo kkkk

// Animações globais

ScrollReveal().reveal('#cta', {
    origin: 'left',
    duration: 2000,
    distance: '20%'
});

ScrollReveal().reveal('.dish', {
    origin: 'left',
    duration: 2000,
    distance: '20%'
});

ScrollReveal().reveal('#testimonals_image', {
    origin: 'left',
    duration: 1000,
    distance: '20%'
});

ScrollReveal().reveal('.feedback', {
    origin: 'right',
    duration: 2000,
    distance: '20%'
});

ScrollReveal().reveal('#primary', {
    origin: 'left',
    duration: 2000,
    distance: '20%'
});

// ------------------------------------------------------------------------------------

//Funcionalidades do carrinho (Botões e tals)

// Inicializar o carrinho usando localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Função global para remover item do carrinho
window.removeItemFromCart = function(itemName, itemSize, itemAdditionals, itemObservations) {
    cart = cart.filter(item => 
        item.name !== itemName || 
        item.size !== itemSize || 
        JSON.stringify(item.additionals.sort()) !== JSON.stringify(itemAdditionals.sort()) || 
        item.observations !== itemObservations
    );
    saveCart();
    updateCartDisplay();
};

// Função global para atualizar a exibição do carrinho
window.updateCartDisplay = function() {
    const cartItemsList = $('.cart-items');
    const cartTotalValue = $('#cart-total-value');
    
    cartItemsList.empty();
    let total = 0;

    cart.forEach(item => {
        const listItem = $('<li>').addClass('cart-item');
        const itemImage = $('<img>').attr('src', item.image).addClass('cart-item-image');
        const itemDetails = $('<div>').addClass('cart-item-details');
        const itemName = $('<h3>').text(item.name);
        const itemPrice = $('<p>').text(`R$ ${item.price.toFixed(2)}`);
        const itemQuantity = $('<p>').text(`Quantidade: ${item.quantity}`);
        const removeButton = $('<button>').addClass('remove-item').text('Remover').on('click', function() {
            removeItemFromCart(item.name, item.size, item.additionals, item.observations);
        });

        itemDetails.append(itemName, itemPrice, itemQuantity, removeButton);
        listItem.append(itemImage, itemDetails);
        cartItemsList.append(listItem);

        total += item.price * item.quantity;
    });

    cartTotalValue.text(total.toFixed(2));
};

// Função global para salvar o carrinho no localStorage
window.saveCart = function() {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Função global para salvar o pedido no localStorage e no banco de dados
window.salvarPedido = function(statusPedido = 'Pago', formaPagamento = 'credito') {
    // Recupera os pedidos já salvos ou inicializa um array vazio
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    // Gera um novo ID incremental
    let novoId = pedidos.length > 0 ? pedidos[pedidos.length - 1].id + 1 : 1;
    // Monta o pedido a partir do carrinho
    let valorTotal = 0;
    let itens = cart.map(item => {
        valorTotal += item.price * item.quantity;
        return {
            nome: item.name,
            tamanho: item.size || '',
            adicionais: item.additionals && item.additionals.length > 0 ? item.additionals.join(', ') : '',
            observacoes: item.observations || '',
            quantidade: item.quantity,
            preco: item.price
        };
    });
    // Para compatibilidade com painel pizzaiolo, salva o primeiro item como pizza principal
    let pizza = itens[0] ? itens[0].nome : '';
    let tamanho = itens[0] ? itens[0].tamanho : '';
    let adicionais = itens[0] ? itens[0].adicionais : '';
    let observacoes = itens[0] ? itens[0].observacoes : '';
    let quantidade = itens[0] ? itens[0].quantidade : 1;
    // Cria o objeto do pedido
    let pedido = {
        id: novoId,
        cliente_id: 1, // Cliente padrão
        cliente: 'Cliente Padrão', // Nome do cliente para exibição
        pizza: pizza,
        tamanho: tamanho,
        adicionais: adicionais,
        observacoes: observacoes,
        quantidade: quantidade,
        valorTotal: valorTotal.toFixed(2),
        status: statusPedido,
        data_pedido: new Date().toISOString(), // Data do pedido
        itens: itens
    };
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Enviar pedido para o backend
    $.ajax({
        url: 'http://localhost:3000/pedidos',
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            cliente_id: pedido.cliente_id,
            forma_pagamento: formaPagamento,
            status: statusPedido,
            data_pedido: pedido.data_pedido,
            valor_total: parseFloat(pedido.valorTotal),
            itens: pedido.itens
        }),
        success: function(response) {
            console.log('Pedido salvo no banco de dados:', response);
        },
        error: function(xhr, status, error) {
            console.error('Erro ao salvar pedido no banco de dados:', error);
            console.log('Dados enviados:', {
                cliente_id: pedido.cliente_id,
                forma_pagamento: formaPagamento,
                status: statusPedido,
                data_pedido: pedido.data_pedido,
                valor_total: parseFloat(pedido.valorTotal),
                itens: pedido.itens
            });
        }
    });
};

$(document).ready(function () {
    const cartSidebar = $('.cart-sidebar');
    const openCartButton = $('#open-cart-sidebar');
    const closeCartButton = $('#close-cart-sidebar');
    const cartItemsList = $('.cart-items');
    const cartTotalValue = $('#cart-total-value');
    const pizzaItemAddButtons = $('.boxs_price button');
    const cartModal = $('#cartModal');
    const closeModalButton = $('.close-button');
    const modalItemName = $('#modal-item-name');
    const pizzaSizesContainer = $('#pizza-sizes');
    const sizeButtons = $('.size-button');
    const selectedPizzaSizeInput = $('#selected-pizza-size');
    const selectedSizeMultiplierInput = $('#selected-size-multiplier');
    const additionalOptions = $('#additional-options input[type="checkbox"]');
    const itemObservationsInput = $('#item-observations');
    const addToCartWithOptionsButton = $('#add-to-cart-with-options');
    const cancelAddToCartButton = $('#cancel-add-to-cart');
    const checkoutButton = $('#checkout-button');
    const paymentModal = $('#paymentModal');
    const paymentCloseButton = $('.payment-close-button');

    let currentItem = null;

    // Inicializar o modal como oculto
    cartModal.css('display', 'none');

    // Atualizar o carrinho ao carregar a página
    updateCartDisplay();

    // detalhes do item
    pizzaItemAddButtons.on('click', function (e) {
        e.preventDefault();
        console.log('Botão de adicionar item clicado');
        
        const box = $(this).closest('.boxs');
        const itemName = box.find('.boxs_title').text();
        const itemBasePriceText = box.find('.boxs_price h4').text().replace('R$ ', '').replace(',', '.');
        const itemBasePrice = parseFloat(itemBasePriceText);
        const itemImageSrc = box.find('.boxs_image').attr('src');

        // Verifica se é uma bebida (não tem modal de opções)
        if (window.location.pathname.includes('Bebidas.html')) {
            addItemToCart(itemName, itemBasePrice, itemImageSrc, null, [], '');
            return;
        }

        currentItem = {
            name: itemName,
            basePrice: itemBasePrice,
            image: itemImageSrc
        };

        console.log('Abrindo modal para:', currentItem);
        modalItemName.text(itemName);
        cartModal.css('display', 'block');

        // Resetar modal ao abrir
        sizeButtons.removeClass('active');
        pizzaSizesContainer.find('[data-size="grande"]').addClass('active'); // Define Grande como padrão
        selectedPizzaSizeInput.val('grande');
        selectedSizeMultiplierInput.val('1.05');
        additionalOptions.prop('checked', false);
        itemObservationsInput.val('');
    });

    // Event listener para os botões de tamanho
    sizeButtons.on('click', function () {
        sizeButtons.removeClass('active');
        $(this).addClass('active');
        selectedPizzaSizeInput.val($(this).data('size'));
        selectedSizeMultiplierInput.val($(this).data('multiplier'));
    });

    // fechar o modal
    closeModalButton.on('click', function () {
        cartModal.css('display', 'none');
        currentItem = null;
    });

    // fechar o modal ao clicar no botão de cancelar
    cancelAddToCartButton.on('click', function () {
        cartModal.css('display', 'none');
        currentItem = null;
    });

    // fechar o modal ao clicar fora dele
    $(window).on('click', function (event) {
        if ($(event.target).is(cartModal)) {
            cartModal.css('display', 'none');
            currentItem = null;
        }
    });

    //adicionar o item ao carrinho com as opções selecionadas
    addToCartWithOptionsButton.on('click', function () {
        if (currentItem) {
            const selectedSize = selectedPizzaSizeInput.val();
            const sizeMultiplier = parseFloat(selectedSizeMultiplierInput.val());
            const selectedAdditionals = [];
            const observations = itemObservationsInput.val();

            additionalOptions.each(function () {
                if ($(this).is(':checked')) {
                    selectedAdditionals.push($(this).val());
                }
            });

            const finalPrice = currentItem.basePrice * sizeMultiplier;
            addItemToCart(currentItem.name, finalPrice, currentItem.image, selectedSize, selectedAdditionals, observations);
            cartModal.css('display', 'none');
            cartSidebar.addClass('open'); // Abre o carrinho automaticamente
            currentItem = null;
        }
    });

    // abrir o sidebar do carrinho
    openCartButton.on('click', function () {
        cartSidebar.addClass('open');
    });

    // fechar o sidebar do carrinho
    closeCartButton.on('click', function () {
        cartSidebar.removeClass('open');
    });

    // adicionar um item ao carrinho
    function addItemToCart(name, price, imageSrc, size, additionals, observations) {
        const existingItem = cart.find(item => 
            item.name === name && 
            item.size === size && 
            JSON.stringify(item.additionals.sort()) === JSON.stringify(additionals.sort()) && 
            item.observations === observations
        );

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: parseFloat(price),
                image: imageSrc,
                size: size,
                additionals: additionals,
                observations: observations,
                quantity: 1
            });
        }
        saveCart();
        updateCartDisplay();
    }

    // Finalizar compra
    checkoutButton.on('click', function() {
        console.log('Botão de finalizar compra clicado');
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        paymentModal.css('display', 'block');
    });

    // Fechar modal de pagamento
    paymentCloseButton.on('click', function() {
        console.log('Botão de fechar modal clicado');
        paymentModal.css('display', 'none');
    });

    // Fechar modal de pagamento ao clicar fora
    $(window).on('click', function(event) {
        if ($(event.target).is(paymentModal)) {
            console.log('Clicou fora do modal de pagamento');
            paymentModal.css('display', 'none');
        }
    });

    // Pagamento com cartão de crédito
    $(document).on('click', '.credito, .vr, .debito', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const tipoPagamento = $(this).hasClass('credito') ? 'credito' : 
                            $(this).hasClass('vr') ? 'vr' : 'debito';
        
        console.log('Botão de ' + tipoPagamento + ' clicado');
        const total = parseFloat($('#cart-total-value').text());
        console.log('Total do carrinho:', total);
        
        // Abre o modal do cartão
        const cartaoModal = `
            <div id="cartaoModal" class="payment-modal" style="display: block;">
                <div class="payment-modal-content">
                    <span class="cartao-close-button">&times;</span>
                    <h2>Pagamento com Cartão de ${tipoPagamento === 'credito' ? 'Crédito' : 
                        tipoPagamento === 'vr' ? 'VR' : 'Débito'}</h2>
                    <form id="cartaoForm">
                        <div class="form-group">
                            <label for="numeroCartao">Número do Cartão:</label>
                            <input type="text" id="numeroCartao" required pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}" 
                                placeholder="1234-5678-9012-3456">
                        </div>
                        <div class="form-group">
                            <label for="valor">Valor Total:</label>
                            <input type="text" id="valor" value="R$ ${total.toFixed(2)}" readonly>
                        </div>
                        <button type="submit" class="btn_default">Confirmar Pagamento</button>
                    </form>
                </div>
            </div>
        `;

        // Remove o modal anterior e adiciona o novo
        paymentModal.css('display', 'none');
        $('body').append(cartaoModal);

        // Adiciona o evento de fechar ao botão "x" do modal de cartão
        $(document).on('click', '.cartao-close-button', function() {
            $('#cartaoModal').remove();
        });

        // Remover qualquer submit antigo para evitar múltiplos alerts
        $(document).off('submit', '#cartaoForm');
        let isProcessing = false; // Variável para controlar se já está processando
        $(document).on('submit', '#cartaoForm', function(e) {
            e.preventDefault();
            if (isProcessing) {
                return; // Se já estiver processando, não faz nada
            }
            isProcessing = true; // Marca que está processando
            console.log('Formulário de cartão submetido');
            
            let numeroCartao = $('#numeroCartao').val();
            console.log('Número do cartão original:', numeroCartao);
            
            // Remove todos os hífens e espaços do número do cartão
            numeroCartao = numeroCartao.replace(/[-\s]/g, '');
            console.log('Número do cartão sem formatação:', numeroCartao);
            
            // Formata o número do cartão com hífens
            numeroCartao = numeroCartao.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
            console.log('Número do cartão formatado:', numeroCartao);
            
            console.log('Valor total:', total);
            console.log('Tipo de pagamento:', tipoPagamento);
            
            // Enviar requisição para o webservice
            const url = 'http://localhost:3000/cartao/compras';
            console.log('Enviando requisição para:', url);
            
            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    numeroCartao: numeroCartao,
                    valor: total,
                    tipoPagamento: tipoPagamento.toLowerCase() // Garantir que está em minúsculo
                }),
                beforeSend: function(xhr) {
                    console.log('Enviando requisição...');
                },
                success: function(response) {
                    console.log('Callback de sucesso chamado!');
                    alert('Pagamento aprovado! Seu pedido foi confirmado.');
                    salvarPedido('Pago', tipoPagamento);
                    // Limpar carrinho
                    cart = [];
                    saveCart();
                    updateCartDisplay();
                    $('#cartaoModal').remove();
                },
                error: function(xhr, status, error) {
                    console.log('Status do erro:', status);
                    console.log('Mensagem de erro:', error);
                    console.log('Resposta do servidor:', xhr.responseText);
                    console.log('Status HTTP:', xhr.status);
                    console.log('Headers:', xhr.getAllResponseHeaders());
                    
                    let mensagem = '';
                    if (xhr.status === 404) {
                        mensagem = 'Cartão não encontrado. Verifique o número e tente novamente.';
                    } else if (xhr.status === 402) {
                        mensagem = 'Saldo insuficiente.';
                    } else if (xhr.status === 403) {
                        mensagem = 'Tipo de cartão não corresponde ao tipo de pagamento selecionado.';
                    } else if (xhr.status === 400) {
                        mensagem = 'Dados incompletos. Verifique os campos e tente novamente.';
                    } else {
                        mensagem = 'Erro ao processar pagamento. Tente novamente mais tarde.';
                    }
                    
                    alert(mensagem);
                },
                complete: function() {
                    isProcessing = false; // Reseta o estado de processamento
                }
            });
        });
    });
});

// pagamento via pix
document.addEventListener('DOMContentLoaded', function () {
    const paymentModal = document.getElementById('paymentModal');
    const pixModal = document.getElementById('pixModal');
  
    const closePaymentBtn = document.querySelector('.payment-close-button');
    const closePixBtn = document.querySelector('.pix-close-button');
    const pixBtn = document.querySelector('.pix');
    const finalizarPedidoBtn = document.getElementById('checkout-button');

    // Abre o modal de formas de pagamento ao clicar no botão "Finalizar Pedido"
    finalizarPedidoBtn.onclick = function () {
        const cartItems = document.querySelectorAll('.cart-items li');
        if (cartItems.length > 0) {
            paymentModal.style.display = 'block';
        } else {
            alert("Seu carrinho está vazio. Adicione itens para finalizar a compra.");
        }
    };

    // Abre o modal de PIX
    pixBtn.onclick = function () {
        paymentModal.style.display = 'none';
        pixModal.style.display = 'block';
    };
  
    // Fechar modais
    closePaymentBtn.onclick = function () {
        paymentModal.style.display = 'none';
    };
  
    closePixBtn.onclick = function () {
        pixModal.style.display = 'none';
    };
  
    // Fechar modal ao clicar fora
    window.onclick = function (event) {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        } else if (event.target === pixModal) {
            pixModal.style.display = 'none';
        }
    };
});
  
  
