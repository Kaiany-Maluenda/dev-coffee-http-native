//Arquivo: orders/orderStatus.js para armazenar os status dos pedidos e verificar se o status é válido.

const orderStatus = Object.freeze({  //object.freeze() para impedir que alguém altere, adicione ou apague propriedades do objeto.
    pending: "pendente", //status do pedido
    inProgress: "em andamento",
    completed: "concluído"
});

const valid_statuses = Object.values(orderStatus); //Object.values() retorna um array com os valores das propriedades do objeto. No caso, retorna ["pendente", "em andamento", "concluído"].

function isValidStatus(status) { //função que verifica se o status é válido
    return valid_statuses.includes(status); //includes() verifica se o array contém o valor passado como argumento. Retorna true ou false.
}

module.exports = { //exporta o objeto orderStatus, o array valid_statuses e a função isValidStatus para que possam ser usados em outros arquivos.
    orderStatus,
    valid_statuses,
    isValidStatus
};