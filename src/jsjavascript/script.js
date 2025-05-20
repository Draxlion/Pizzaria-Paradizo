// ------------------------------------------------------------------------------------

//Funcionalidades do carrinho (Botões e tals)

// Inicializar o carrinho usando localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Função global para salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função global para adicionar item ao carrinho
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

// Função global para remover item do carrinho
function removeItemFromCart(itemName, itemSize, itemAdditionals, itemObservations) {
    try {
        // Converter string JSON de adicionais para array
        const additionalsArray = JSON.parse(itemAdditionals);
        
        // Encontrar o índice do item no carrinho
        const itemIndex = cart.findIndex(item => 
            item.name === itemName && 
            item.size === itemSize && 
            JSON.stringify(item.additionals.sort()) === JSON.stringify(additionalsArray.sort()) && 
            item.observations === itemObservations
        );

        if (itemIndex !== -1) {
            // Remover o item do carrinho
            cart.splice(itemIndex, 1);
            // Salvar carrinho atualizado
            saveCart();
            // Atualizar exibição
            updateCartDisplay();
        }
    } catch (error) {
        console.error('Erro ao remover item do carrinho:', error);
    }
}

// Função global para atualizar a exibição do carrinho
function updateCartDisplay() {
    const cartItemsList = $('.cart-items');
    const cartTotalValue = $('#cart-total-value');
    
    cartItemsList.empty();
    let total = 0;

    cart.forEach(item => {
        const listItem = $('<li>');
        const additionalsText = item.additionals.length > 0 ? `<br>Adicionais: ${item.additionals.join(', ')}` : '';
        const observationsText = item.observations ? `<br>Observações: ${item.observations}` : '';
        const sizeText = item.size ? `<br>Tamanho: ${item.size}` : '';
        
        listItem.html(`
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <span>R$ ${item.price.toFixed(2)} x ${item.quantity}</span>
                ${sizeText}
                ${additionalsText}
                ${observationsText}
            </div>
            <button class="remove-item" onclick="removeItemFromCart('${item.name}', '${item.size}', '${JSON.stringify(item.additionals)}', '${item.observations}')">
                <i class="bi bi-trash"></i>
            </button>
        `);
        
        cartItemsList.append(listItem);
        total += item.price * item.quantity;
    });

    cartTotalValue.text(total.toFixed(2));
}

$(document).ready(function () {
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

    // Finalizar compra
    checkoutButton.on('click', function() {
// ... existing code ...
    });
}); 