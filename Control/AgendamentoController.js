const AgendamentoModel = require('../Model/entidades/AgendamentoModel');


class AgendamentoController {
    async Obter(req, res) {
        try {
            const agendamentos = await AgendamentoModel.ObterTodos();
            return res.status(200).json(agendamentos);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter agendamentos", error: error.message });
        }
    }
    async Check(req, res) {
        try {
            const { id } = req.params; 
            
            const resultado = await AgendamentoModel.check(id);
    
            // Retorna o resultado para o cliente
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao realizar check-in/check-out", error: error.message });
        }
    }
    
    async Aprovar(req, res) {
        try {
            const { id } = req.params; // O ID do agendamento que será aprovado

            // Chama a função de aprovação no modelo
            const aprovado = await AgendamentoModel.aprovarAgendamento(id);

            if (aprovado) {
                return res.status(200).json({ message: "Agendamento aprovado com sucesso" });
            } else {
                return res.status(404).json({ message: "Agendamento não encontrado" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Erro ao aprovar agendamento", error: error.message });
        }
    }

    async VerificarDisponibilidade(req, res) {
        try {
            const { sal_id, age_data, age_horario_inicio, age_horario_fim } = req.body;

            // Verifique a disponibilidade no modelo
            const disponivel = await AgendamentoModel.verificarDisponibilidade(sal_id, age_data, age_horario_inicio, age_horario_fim);

            return res.status(200).json({ disponivel });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao verificar disponibilidade", error: error.message });
        }
    }

    async Inserir(req, res) {
        try {
            const agendamento = new AgendamentoModel(req.body);
            console.log('Agendamento recebido:', agendamento);
    
            // Insere o agendamento no banco
            const agendamentoInserido = await AgendamentoModel.criar(agendamento);
    

                return res.status(200).json(agendamentoInserido);
            
        } catch (error) {
            // Verifique se o erro é devido à sala já estar agendada
            if (error.message === "Sala já está agendada nesse horário.") {
                return res.status(400).json({ message: "Sala já está agendada nesse horário." });
            }
            return res.status(500).json({ message: "Erro ao inserir agendamento", error: error.message });
        }
    }
    
    

    async ObterPorId(req, res) {
        try {
            const { id } = req.params;
            const agendamento = await AgendamentoModel.ObterPorId(id);
            return agendamento ? res.status(200).json(agendamento) : res.status(404).json({ message: "Agendamento não encontrado" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter agendamento", error: error.message });
        }
    }

    async Excluir(req, res) {
        try {
            const { id } = req.params;
            const excluir = await AgendamentoModel.Excluir(id);
            if (excluir) {
                return res.status(200).json({ message: "Agendamento excluído com sucesso" });
            } else {
                return res.status(404).json({ message: "Agendamento não encontrado" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Erro ao excluir agendamento", error: error.message });
        }
    }

    async Editar(req, res) {
        try {
            const { id } = req.params; // Obtém o ID do agendamento a ser editado
            const agendamento = new AgendamentoModel({ ...req.body, age_id: id }); // Cria uma nova instância do modelo
    
            // Tenta editar o agendamento
            const agendamentoEditado = await AgendamentoModel.editar(agendamento);
    
            // Verifica se o agendamento foi editado com sucesso
            if (agendamentoEditado) {
                return res.status(200).json({ 
                    message: "Agendamento editado com sucesso", 
                    agendamento: agendamentoEditado 
                });
            } else {
                return res.status(404).json({ message: "Agendamento não encontrado" });
            }
        } catch (error) {
            // Verifique se o erro é devido à sala já estar agendada
            if (error.message === "Sala já está agendada nesse horário.") {
                return res.status(400).json({ message: "Sala já está agendada nesse horário." });
            }
            return res.status(500).json({ message: "Erro ao editar agendamento", error: error.message });
        }
    }
    
    

    // Adicionando a busca por data
    async BuscarPorData(req, res) {
        try {
            const { data } = req.body; 
            const agendamentos = await AgendamentoModel.BuscarPorData(data);
            return res.status(200).json(agendamentos);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar agendamentos por data", error: error.message });
        }
    }
    

}

module.exports = AgendamentoController;
