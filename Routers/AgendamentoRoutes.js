const AgendamentoController = require("../Controller/AgendamentoController");
const agendamentoC = new AgendamentoController();
const express = require('express');
const router = express.Router();

// Rotas para agendamentos
router.post('/verificar-disponibilidade', agendamentoC.VerificarDisponibilidade.bind(agendamentoC)); // Verificar disponibilidade
router.get('/', agendamentoC.Obter.bind(agendamentoC)); // Obtém todos os agendamentos
router.post('/', agendamentoC.Inserir.bind(agendamentoC)); // Insere um novo agendamento
router.get('/:id', agendamentoC.ObterPorId.bind(agendamentoC)); // Obtém um agendamento específico por ID
router.delete('/:id', agendamentoC.Excluir.bind(agendamentoC)); // Exclui um agendamento por ID


// Novas funcionalidades
router.post('/data', agendamentoC.BuscarPorData.bind(agendamentoC)); // Busca agendamentos por data

// Rota para editar agendamento
router.put('/aprovar/:id', agendamentoC.Aprovar.bind(agendamentoC)); // Aprovar agendamento
router.put('/:id', agendamentoC.Editar.bind(agendamentoC)); // Edita um agendamento por ID

module.exports = router;
