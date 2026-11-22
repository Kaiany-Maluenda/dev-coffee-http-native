Dev Coffee — API REST de Pedidos (Node.js HTTP Nativo)

API REST modular desenvolvida com o módulo nativo `http` do Node.js para gerenciar pedidos de uma cafeteria, com operações de criação, consulta, filtro por status, atualização de status e remoção.

## Arquitetura do Projeto

dev-coffee-http-native/
├── orders/
│   ├── orderLoja.js     # Regras de negócio, estado em memória, ID sequencial e CRUD
│   ├── orderRotas.js    # Roteamento, leitura de corpo JSON e respostas HTTP
│   └── orderStatus.js   # Estados permitidos e validação de status
├── package.json
├── README.md
└── server.js            # Ponto de entrada e servidor HTTP


## Requisições(através do Powersheel Windows)
# Listar todos os pedidos (GET/orders)
curl.exe -X GET http://localhost:3000/orders
# Listar com filtro por status 
curl.exe -X GET "http://localhost:3000/orders?status=pendente"
# Buscar pedido por ID (GET /orders/:id)
curl.exe -X GET http://localhost:3000/orders/1
# Criar novo pedido (POST /orders)
$pedido = '{"client":"Ana","item":["Latte"]}'; Invoke-RestMethod -Uri "http://localhost:3000/orders" -Method POST -ContentType "application/json" -Body $pedido | ConvertTo-Json -Depth 5 
# Atualizar status do pedido (PATCH /orders/:id/status)
$statusBody = '{"status":"em andamento"}'; Invoke-RestMethod -Uri "http://localhost:3000/orders/1/status" -Method PATCH -ContentType "application/json" -Body $statusBody | ConvertTo-Json -Depth 5
# Deletar pedido (DELETE /orders/:id)
curl.exe -X DELETE http://localhost:3000/orders/1

Criado por Kaiany Moraes Maluenda,
https://github.com/Kaiany-Maluenda/dev-coffee-http-native/new/main?filename=README.md
