const FuncionarioController = require('../Control/FuncionarioController');
const express = require('express');
const router = express.Router();

const FuncionariosC = new FuncionarioController();

// Rota pública (não requer autenticação)
router.post('/autenticar', FuncionariosC.Autenticar);
router.post('/redefinir', FuncionariosC.RedefinirSenha);

// Rotas protegidas
router.get('/', FuncionariosC.Obter);
router.get('/:id', FuncionariosC.ObterID);
router.get('/buscar/:busca', FuncionariosC.ObterNome);
router.post('/', FuncionariosC.Inserir);
router.post('/trocar-senha', FuncionariosC.TrocarSenha);
router.put('/:id', FuncionariosC.Atualizar);
router.delete('/:id', FuncionariosC.Excluir);

module.exports = router;
