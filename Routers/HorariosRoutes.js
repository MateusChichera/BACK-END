const HorariosController = require('../Control/HorariosController');

const HorarioC = new HorariosController;
const express = require('express');
const router = express.Router();


router.get('/',HorarioC.Obter);
router.get('/:id',HorarioC.ObterID);
router.get('/buscar/:busca',HorarioC.ObterNome);
router.post('/',HorarioC.Inserir);
router.put('/:id',HorarioC.Atualizar);
router.delete('/:id',HorarioC.Excluir);

module.exports = router;