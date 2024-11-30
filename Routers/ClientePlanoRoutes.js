const ClientePlanoController = require('../Control/clienteplanoController');
const express = require('express');
const router = express.Router();

const clientePlanoCtrl = new ClientePlanoController();

// Rotas para gerenciar a relação entre cliente e plano
router.post('/', clientePlanoCtrl.associar);           // Associa cliente a um plano
router.get('/', clientePlanoCtrl.ObterTodos);                  // Obtem todas as associações
router.get('/:cli_id/:pla_id', clientePlanoCtrl.ObterPorClienteEPlano); // Obtem associação específica por cliente e plano
router.delete('/:cli_id/:pla_id', clientePlanoCtrl.Excluir);   // Exclui uma associação entre cliente e plano

module.exports = router;
