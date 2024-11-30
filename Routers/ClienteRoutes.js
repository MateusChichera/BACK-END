const ClienteController = require("../Control/ClienteController");


const ClienteC = new ClienteController();
const express = require('express');
const router = express.Router();

// Aplicar autenticação a todas as rotas

// Rotas protegidas
router.get('/', ClienteC.Obter);
router.get('/buscar/:cli_nome', ClienteC.Busca);
router.get('/:id', ClienteC.BuscaID);
router.post('/', ClienteC.Inserir);
router.put('/:id', ClienteC.Atualizar);
router.delete('/:id', ClienteC.Excluir);
router.get('/cnpj/:cnpj', ClienteC.BuscarCNPJ);

module.exports = router;
