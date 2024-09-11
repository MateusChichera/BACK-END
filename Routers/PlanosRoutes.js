const express = require('express');
const PlanosController = require('../Controller/PlanosController');
const router = express.Router();

// Instância do controlador
const planosController = new PlanosController();

// Definindo rotas
router.get('/', planosController.Obter.bind(planosController));             // Obtem todos os planos
router.get('/:id', planosController.ObterID.bind(planosController));       // Obtem plano por ID
router.get('/buscar/:busca', planosController.ObterNome.bind(planosController)); // Obtem plano por nome
router.post('/', planosController.Inserir.bind(planosController));          // Insere um novo plano
router.put('/:id', planosController.Atualizar.bind(planosController));      // Atualiza um plano
router.delete('/:id', planosController.Excluir.bind(planosController));    // Exclui um plano

module.exports = router;
