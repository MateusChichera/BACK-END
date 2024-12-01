const ClientePlanoModel = require('../Model/entidades/ClientePlano');

class ClientePlanoController {

    // Associar cliente a um plano
    async associar(req, res) {
        try {
            const clientePlano = new ClientePlanoModel(req.body);
            console.log("Associando Cliente ao Plano:", clientePlano);

            const associacao = await ClientePlanoModel.associar(clientePlano);
            return res.status(200).json({ message: "Plano associado com sucesso!" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao associar cliente ao plano", error: error.message });
        }
    }

    // Obter todas as associações entre clientes e planos
    async ObterTodos(req, res) {
        try {
            const clientePlanos = await ClientePlanoModel.ObterTodos();
            return res.status(200).json(clientePlanos);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter as associações entre clientes e planos", error: error.message });
        }
    }

    // Obter uma associação específica (por cliente e plano)
    async ObterPorClienteEPlano(req, res) {
        try {
            const { cli_id, pla_id } = req.params;
            const clientePlano = await ClientePlanoModel.ObterPorClienteEPlano(cli_id, pla_id);
            return res.status(200).json(clientePlano);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter a associação", error: error.message });
        }
    }

    // Excluir uma associação entre cliente e plano
    async Excluir(req, res) {
        try {
            const { cli_id, pla_id } = req.params;
            const exclusao = await ClientePlanoModel.Excluir(cli_id, pla_id);
            return res.status(200).json({ message: "Associação entre cliente e plano excluída com sucesso" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao excluir a associação", error: error.message });
        }
    }

    async Vendas(req, res) {
        try {
            // Extrai datas de início e fim dos parâmetros da requisição
            const { dataInicio, dataFim } = req.body;
    
            if (!dataInicio || !dataFim) {
                return res.status(400).json({ message: 'Datas de início e fim são obrigatórias.' });
            }
    
            const relatorio = await ClientePlanoModel.VendasMensal(dataInicio, dataFim); 
    
            if (!relatorio || relatorio.length === 0) {
                return res.status(404).json({ message: 'Nenhum dado encontrado para o período especificado.' });
            }
    
            res.json(relatorio);
        } catch (error) {
            console.error('Erro ao gerar relatório:', error); 
            res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
        }
    }
    
    
    
}

module.exports = ClientePlanoController;
