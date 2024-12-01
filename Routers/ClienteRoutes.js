const ClienteController = require("../Control/ClienteController");


const ClienteC = new ClienteController();
const express = require('express');
const router = express.Router();


router.get('/relatorio', ClienteC.Rel);
router.get('/leads', ClienteC.Leads);
router.get('/planos', ClienteC.ClientesPlanos);
// Rotas protegidas
router.get('/buscar/:cli_nome', ClienteC.Busca);
router.get('/:id', ClienteC.BuscaID);
router.put('/:id', ClienteC.Atualizar);
router.delete('/:id', ClienteC.Excluir);
router.get('/cnpj/:cnpj', ClienteC.BuscarCNPJ);
router.get('/', ClienteC.Obter);
router.post('/', ClienteC.Inserir);


module.exports = router;
