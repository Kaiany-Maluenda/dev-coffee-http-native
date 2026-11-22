//Arquivo: orders/orderLoja.js para criar, filtrar e atualizar pedidos.

const { orderStatus, isValidStatus } = require("./orderStatus"); //importa o objeto orderStatus e a função isValidStatus do arquivo orderStatus.js

const orders = []; //array que vai armazenar os pedidos
let nextId = 1; //variável que vai armazenar o próximo id a ser atribuído a um pedido

function createOrder({ id, client, item }) { //função que cria um pedido com os dados passados como argumento. O argumento é um objeto que contém as propriedades id, client e item. A função retorna o pedido criado.
  if (!client || typeof client !== "string" || !client.trim()) { //verifica se o campo client é obrigatório e se é uma string não vazia. Se não for, lança um erro.
    throw new Error("Campo 'client' é obrigatório"); //lança um erro caso o campo client seja inválido
  }

  const isValidItem = 
    (Array.isArray(item) && item.length > 0) || //verifica se o campo item é obrigatório e se é um array não vazio. Se não for, lança um erro.
    (typeof item === "string" && item.trim().length > 0); //verifica se o campo item é obrigatório e se é uma string não vazia. Se não for, lança um erro.

  if (!isValidItem) {
    throw new Error("Campo 'item' é obrigatório"); //lança um erro caso o campo item seja inválido
  }

  const numericId = id !== undefined && id !== null && id !== "" ? Number(id) : nextId++; //verifica se o id é um número. Se não for, atribui o próximo id disponível. Se for, atribui o id passado como argumento.
  if (numericId >= nextId) {//verifica se o id passado como argumento é maior ou igual ao próximo id disponível. Se for, atualiza o próximo id disponível.
    nextId = numericId + 1;
  }

  const order = { //cria um objeto order com as propriedades id, client, item e status. O status é definido como "pendente" por padrão.
    id: numericId, //atribui o id ao pedido
    client: client.trim(), //atribui o client ao pedido e remove espaços em branco no início e no final da string
    item, //atribui o item ao pedido
    status: orderStatus.pending //atribui o status ao pedido
  };

  orders.push(order); //adiciona o pedido ao array orders
  return order;
}

function listOrders(statusFilter) { //função que retorna a lista de pedidos. Se o argumento statusFilter for passado, filtra os pedidos pelo status. Se o statusFilter for inválido, lança um erro.
  if (!statusFilter) {
    return orders;
  }

  if (!isValidStatus(statusFilter)) { //verifica se o statusFilter é válido. Se não for, lança um erro.
    throw new Error(`Status inválido: ${statusFilter}`); 
  }

  return orders.filter((order) => order.status === statusFilter); //filtra os pedidos pelo status
}

function findOrderById(id) { //função que retorna o pedido com o id passado como argumento. Se não existir, retorna null.
  if (id === undefined || id === null) { //verifica se o id é undefined ou null. Se for, retorna null.
    return null;
  }
  const numericId = Number(id); //verifica se o id é um número. Se não for, retorna null.
  return orders.find((order) => Number(order.id) === numericId) || null;
}

function updateOrderStatus(id, newStatus) { //função que atualiza o status do pedido com o id passado como argumento. Se não existir, retorna null. Se o status for inválido, lança um erro.
  if (!isValidStatus(newStatus)) {
    throw new Error(`Status inválido: ${newStatus}`); //verifica se o status é válido. Se não for, lança um erro.
  }

  const order = findOrderById(id); //verifica se o pedido existe. Se não existir, retorna null.
  if (!order) {
    return null;
  }

  order.status = newStatus; //atualiza o status do pedido
  return order;
}

function deleteOrder(id) { //função que deleta o pedido com o id passado como argumento. Se não existir, retorna false. Se existir, retorna true.
  if (id === undefined || id === null) { //verifica se o id é undefined ou null. Se for, retorna false.
    return false;
  }
  const numericId = Number(id);
  const index = orders.findIndex((order) => Number(order.id) === numericId); //verifica se o pedido existe. Se não existir, retorna false.
  if (index === -1) {
    return false;
  }

  orders.splice(index, 1); //remove o pedido do array orders
  return true;
}

module.exports = { //exporta as funções para que possam ser usadas em outros arquivos
  createOrder,
  updateOrderStatus,
  listOrders,
  findOrderById,
  deleteOrder
};