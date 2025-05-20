const pizzas = [
    { nome: 'Calabresa', ing: 'Molho tradicional, Calabresa fatiada seara, cebola em rodelas, azeitonas, orégano', preco: 'R$ 45,00' },
    { nome: 'Marguerita', ing: 'Queijo, tomates fatiados, manjericão, molho de tomate', preco: 'R$ 63,00' },
    { nome: 'Calzone de Portuguesa', ing: 'Muçarela, presunto, ovos de codorna, palmito, milho, bacon, orégano', preco: 'R$ 59,00' },
    { nome: 'Quatro Queijos', ing: 'Molho de tomate, muçarela, cremely, provolone, parmesão, azeite', preco: 'R$ 68,00' },
    { nome: 'Palmito', ing: 'Palmito, muçarela, molho de tomate fresco, orégano', preco: 'R$ 40,00' },
    { nome: 'Vegetariana', ing: 'Escarola, molho especial, tomate em rodelas, milho, palmito, muçarela', preco: 'R$ 70,00' },
    { nome: 'Bacon', ing: 'Molho de tomate, catupiry, bacon frito, cebola roxa em fatia, azeitona, orégano', preco: 'R$ 49,00' },
    { nome: 'Sardinha', ing: 'Azeite, sardinha, muçarela, pimentão verde, cebola, azeitona, orégano', preco: 'R$ 38,00' },
    { nome: 'Nutella com Morango', ing: 'Nutella cremosa e morangos frescos', preco: 'R$ 62,00' },
    { nome: 'Banana com Canela', ing: 'Banana caramelizada com açúcar e canela', preco: 'R$ 50,00' },
    { nome: 'Framboesa', ing: 'Framboesas frescas com cobertura doce especial', preco: 'R$ 60,00' },
    { nome: 'Doce de Leite e Coco', ing: 'Doce de leite cremoso com coco ralado', preco: 'R$ 55,00' },
    { nome: 'Maçã com Caramelo', ing: 'Maçãs levemente cozidas com calda de caramelo', preco: 'R$ 58,00' },
    { nome: 'Chocolate Preto com Laranja', ing: 'Chocolate meio amargo e raspas de laranja', preco: 'R$ 63,00' },
    { nome: 'Morango com Creme de Leite', ing: 'Morangos frescos e creme de leite adoçado', preco: 'R$ 59,00' },
    { nome: 'Marshmallow e Chocolate', ing: 'Chocolate ao leite com marshmallows derretidos', preco: 'R$ 61,00' }
  ];

  const tbody = document.getElementById('pizzaTableBody');
  pizzas.forEach((pizza, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = i;
    tr.innerHTML = `
      <td>0${i + 1}</td>
      <td>${pizza.nome}</td>
      <td>${pizza.ing}</td>
      <td>${pizza.preco}</td>
      <td class="status">Ativo</td>
      <td>
        <button class="edit" onclick="abrirModal(this)">Editar</button>
        <button class="toggle active" onclick="alternarStatus(this)">Desativar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  function buscarPizza() {
    const filtro = document.getElementById('searchInput').value.toLowerCase();
    const linhas = document.querySelectorAll('#pizzaTableBody tr');
    linhas.forEach(linha => {
      const nome = linha.children[1].textContent.toLowerCase();
      linha.style.display = nome.includes(filtro) ? '' : 'none';
    });
  }

  let linhaEditando = null;
  function abrirModal(botao) {
    linhaEditando = botao.closest('tr');
    document.getElementById('editNome').value = linhaEditando.children[1].textContent;
    document.getElementById('editIngredientes').value = linhaEditando.children[2].textContent;
    document.getElementById('editPreco').value = linhaEditando.children[3].textContent.replace('R$ ', '');
    document.getElementById('editModal').style.display = 'flex';
  }

  function fecharModal() {
    document.getElementById('editModal').style.display = 'none';
    linhaEditando = null;
  }

  document.getElementById('salvarEdicao').addEventListener('click', () => {
    if (linhaEditando) {
      linhaEditando.children[1].textContent = document.getElementById('editNome').value;
      linhaEditando.children[2].textContent = document.getElementById('editIngredientes').value;
      linhaEditando.children[3].textContent = `R$ ${document.getElementById('editPreco').value}`;
      fecharModal();
    }
  });

  function alternarStatus(botao) {
    const statusCell = botao.closest('tr').querySelector('.status');
    if (statusCell.innerText === 'Ativo') {
      statusCell.innerText = 'Inativo';
      botao.innerText = 'Ativar';
      botao.classList.remove('active');
      botao.classList.add('inactive');
    } else {
      statusCell.innerText = 'Ativo';
      botao.innerText = 'Desativar';
      botao.classList.remove('inactive');
      botao.classList.add('active');
    }
  }

  function abrirModalAdicionar() {
    document.getElementById('addModal').style.display = 'flex';
  }

  function fecharModalAdicionar() {
    document.getElementById('addModal').style.display = 'none';
  }

  function adicionarPizza() {
    const nome = document.getElementById('addNome').value;
    const ingredientes = document.getElementById('addIngredientes').value;
    const preco = document.getElementById('addPreco').value;

    if (!nome || !ingredientes || !preco) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const novaPizza = {
      nome: nome,
      ing: ingredientes,
      preco: `R$ ${preco}`
    };

    pizzas.push(novaPizza);

    const tr = document.createElement('tr');
    tr.dataset.id = pizzas.length - 1;
    tr.innerHTML = `
      <td>0${pizzas.length}</td>
      <td>${novaPizza.nome}</td>
      <td>${novaPizza.ing}</td>
      <td>${novaPizza.preco}</td>
      <td class="status">Ativo</td>
      <td>
        <button class="edit" onclick="abrirModal(this)">Editar</button>
        <button class="toggle active" onclick="alternarStatus(this)">Desativar</button>
      </td>
    `;
    document.getElementById('pizzaTableBody').appendChild(tr);

    // Limpar campos e fechar modal
    document.getElementById('addNome').value = '';
    document.getElementById('addIngredientes').value = '';
    document.getElementById('addPreco').value = '';
    fecharModalAdicionar();
  }