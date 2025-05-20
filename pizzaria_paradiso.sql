-- Criação do banco de dados
DROP DATABASE IF EXISTS pizzaria_paradiso;
CREATE DATABASE pizzaria_paradiso;
USE pizzaria_paradiso;

-- Tabela de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    status ENUM('ativo', 'inativo') DEFAULT 'ativo'
);

-- Tabela de endereços (relacionada com clientes)
CREATE TABLE enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    referencia VARCHAR(255),
    cidade VARCHAR(100) DEFAULT 'São Paulo',
    estado VARCHAR(2) DEFAULT 'SP',
    cep VARCHAR(10),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Tabela de pizzas
CREATE TABLE pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ingredientes TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    imagem VARCHAR(255),
    status ENUM('ativo', 'inativo') DEFAULT 'ativo'
);

-- Tabela de bebidas
CREATE TABLE bebidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    imagem VARCHAR(255),
    status ENUM('ativo', 'inativo') DEFAULT 'ativo'
);

-- Tabela de pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    forma_pagamento ENUM('cartao', 'dinheiro') NOT NULL,
    status ENUM('Aguardando pagamento', 'Pago', 'Preparando', 'Entregue') DEFAULT 'Aguardando pagamento',
    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Tabela de itens do pedido
CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    tipo ENUM('pizza', 'bebida') NOT NULL,
    item_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    tamanho VARCHAR(20),
    adicionais TEXT,
    observacoes TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
); 