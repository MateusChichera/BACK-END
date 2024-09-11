const SalasController = require('../Controller/SalasController');

const SalaC = new SalasController;
const express = require('express');
const router = express.Router();


router.get('/',SalaC.Obter);
router.get('/:id',SalaC.ObterID);
router.get('/buscar/:busca',SalaC.ObterNome);
router.post('/',SalaC.Inserir);
router.put('/:id',SalaC.Atualizar);
router.delete('/:id',SalaC.Excluir);




module.exports = router;