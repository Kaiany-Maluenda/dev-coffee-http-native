//Arquivo: orders/orderRotas.js para definir as rotas da API e enviar as respostas em formato JSON.

const { orderStatus, isValidStatus } = require("./orderStatus"); //importa o objeto orderStatus e a função isValidStatus do arquivo orderStatus.js
const {
  createOrder,
  updateOrderStatus,
  listOrders,
  findOrderById,
  deleteOrder
} = require("./orderLoja");

function sendJson(res, statusCode, payload) { //função que envia a resposta em formato JSON. 
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" }); //writeHead() define o statusCode e o Content-Type da resposta. O Content-Type é definido como application/json para indicar que a resposta é em formato JSON. O charset=utf-8 é definido para garantir que os caracteres especiais sejam exibidos corretamente.
  res.end(JSON.stringify(payload)); //end() envia a resposta. JSON.stringify() converte o objeto payload em uma string JSON.
}

function readJsonBody(req) { //função que lê o corpo da requisição e retorna um objeto JSON. 
  return new Promise((resolve, reject) => { //cria uma Promise que resolve com o objeto JSON ou rejeita com um erro
    let body = ""; //variável que vai armazenar o corpo da requisição. Inicialmente é uma string vazia.

    req.on("data", (chunk) => { //on() adiciona um listener para o evento "data" do objeto req. O evento "data" é emitido quando um chunk de dados é recebido. O chunk é um Buffer que contém os dados recebidos.
      body += chunk.toString("utf-8"); //converte o chunk para string usando o encoding "utf-8" e adiciona à variável body. O encoding "utf-8" é usado para garantir que os caracteres especiais sejam exibidos corretamente.
    });

    req.on("end", () => { 
      if (!body.trim()) { //verifica se o corpo da requisição é vazio. Se for, resolve a Promise com um objeto vazio.
        resolve({});
        return;
      }

      try {
        const json = JSON.parse(body); //JSON.parse() converte a string JSON em um objeto JavaScript. Se o corpo da requisição não for um JSON válido, lança um erro.
        resolve(json);
      } catch (error) {
        reject(new Error("Corpo da requisição inválido")); //rejeita a Promise com um erro caso o corpo da requisição seja inválido
      }
    });

    req.on("error", (error) => { 
      reject(error);
    });
  });
}

async function handleOrderOrders(req, res) { //função que trata as rotas da API. 
  const host = req.headers.host || "localhost:3000"; //verifica se o host é definido no cabeçalho da requisição. Se não for, define como "localhost:3000". O host é usado para criar a URL completa da requisição.
  const url = new URL(req.url, `http://${host}`); 
  const path = url.pathname;

    // GET /orders
  if (req.method === "GET" && path === "/orders") { //verifica se o método da requisição é GET e se o path é "/orders". Se for, trata a rota.
    const statusFilter = url.searchParams.get("status"); //verifica se o parâmetro "status" está presente na query string da requisição. Se estiver, atribui o valor à variável statusFilter. Se não estiver, atribui null.
    try {
      const data = listOrders(statusFilter); 
      sendJson(res, 200, { orders: data });
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return true;
  }

  // POST /orders
  if (req.method === "POST" && path === "/orders") { //verifica se o método da requisição é POST e se o path é "/orders". Se for, trata a rota.
    try {
      const body = await readJsonBody(req); //lê o corpo da requisição e retorna um objeto JSON. Se o corpo da requisição for inválido, lança um erro.
      const order = createOrder(body); //cria um pedido com os dados passados no corpo da requisição. Se algum campo obrigatório estiver ausente ou inválido, lança um erro.
      sendJson(res, 201, { order });
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return true;
  }

  // PATCH /orders/:id/status
  const statusMatch = path.match(/^\/orders\/(\d+)\/status$/); //verifica se o path corresponde ao padrão. Se corresponder, atribui o valor do id à variável statusMatch[1]. Se não corresponder, atribui null.
  if (req.method === "PATCH" && statusMatch) {
    const orderId = Number(statusMatch[1]);
    try {
      const body = await readJsonBody(req);
      if (!body.status || !isValidStatus(body.status)) {
        sendJson(res, 400, {
          error: "Status inválido",
          valid_statuses: Object.values(orderStatus)
        });
        return true;
      }

      const updatedOrder = updateOrderStatus(orderId, body.status); //atualiza o status do pedido com o id passado como argumento. Se o pedido não existir, retorna null. Se o status for inválido, lança um erro.
      if (!updatedOrder) {
        sendJson(res, 404, { error: "Pedido não encontrado" });
        return true;
      }

      sendJson(res, 200, { order: updatedOrder });
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return true;
  }

  // GET /orders/:id
  const detailMatch = path.match(/^\/orders\/(\d+)$/); //verifica se o path corresponde ao padrão. Se corresponder, atribui o valor do id à variável detailMatch[1]. Se não corresponder, atribui null.
  if (req.method === "GET" && detailMatch) {
    const orderId = Number(detailMatch[1]);
    const order = findOrderById(orderId);
    if (!order) {
      sendJson(res, 404, { error: "Pedido não encontrado" });
      return true;
    }

    sendJson(res, 200, { order });
    return true;
  }

  // DELETE /orders/:id
  if (req.method === "DELETE" && detailMatch) { //verifica se o método da requisição é DELETE e se o path corresponde ao padrão. Se for, trata a rota.
    const orderId = Number(detailMatch[1]);
    const removed = deleteOrder(orderId);
    if (!removed) {
      sendJson(res, 404, { error: "Pedido não encontrado" });
      return true;
    }

    res.writeHead(204);
    res.end();
    return true;
  }

  return false;
}

module.exports = {
  handleOrderOrders
};