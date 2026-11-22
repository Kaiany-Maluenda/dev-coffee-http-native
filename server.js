const http = require("http");
const { createOrder, updateOrderStatus, listOrder, findOrderById  } = require("./orders/orderLoja"); //importa as funções do arquivo orderLoja.js
const { orderStatus } = require("./orders/orderStatus"); //importa o objeto orderStatus do arquivo orderStatus.js
const { handleOrderOrders } = require("./orders/orderRotas"); //importa a função handleOrderOrders do arquivo orderRotas.js

const PORT = 3000; //define a porta do servidor como 3000

createOrder({
    id: 1,
    client: "Kaiany",
    item: ["Café Latte", "Bolo"],
    status: orderStatus.pending
});

const server = http.createServer(async (req, res) => {
    const handled = await handleOrderOrders(req, res);
    if (handled) {
        return;
    }

    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Rota não encontrada" }));
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
