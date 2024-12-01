const ClienteModel = require('../Model/entidades/Clientemodel');


class ClienteController {

    async Busca(req, res) {
        try {
            const nome = req.params.cli_nome;

            console.log("dentro da função buscar:",nome);
            const clientes = await ClienteModel.Busca(nome);
            
            return res.status(200).json(clientes);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter cliente", error: error.message });
        }
    }
    async BuscaID(req, res) {
        try {
            const { id } = req.params;

           
            const clientes = await ClienteModel.BuscaID(id);
            
            return res.status(200).json(clientes);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter cliente", error: error.message });
        }
    }

    async Obter(req, res) {
        try {
            const clientes = await ClienteModel.ObterTodos();
            return res.status(200).json(clientes);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter clientes", error: error.message });
        }
    }

    async Inserir(req, res) {
        try {
            const cliente = new ClienteModel(req.body);
            console.log('Cliente recebido:', cliente);
            const clienteInserido = await ClienteModel.Inserir(cliente);
            return res.status(200).json(clienteInserido);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao inserir cliente", error: error.message });
        }
    }
    async Atualizar(req, res) {
        try {
            const { id } = req.params;

            const cliente = new ClienteModel(req.body);
            console.log("cliente dentro da atualizar",cliente);
            const clienteAtualizado = await ClienteModel.Atualizar(cliente,id);
            return res.status(200).json({message:"Cliente Atualizado com sucesso"});
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar cliente", error: error.message });
        }
    }

    async Excluir(req, res) {
        try {
            const { id } = req.params;
            const excluir = await ClienteModel.Excluir(id);
            console.log(`ID: ${id}`);  // Add logging for debugging
                return res.status(200).json({ message: "Cliente excluído com sucesso" });
           
        } catch (error) {
            return res.status(500).json({ message: "Erro ao excluir cliente", error: error.message });
        }
    }

    //-------------------------------------------------------------BUSCAR CNPJ
    async BuscarCNPJ(req, res) {
        try {
            const { cnpj } = req.params;
            const dadosCNPJ = await ClienteModel.buscarCNPJ(cnpj);
            return res.status(200).json(dadosCNPJ);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar dados do CNPJ", error: error.message });
        }
    }
    //--------------------------------------------------------------RELATORIOS
    async Rel(req, res) {
        try {
            const relatorio = await ClienteModel.RelCheck(); 
            if (!relatorio || relatorio.length === 0) {
                return res.status(404).json({ message: 'Nenhum dado encontrado para o relatório.' });
            }
            res.json(relatorio); // Retorna os dados para o cliente
        } catch (error) {
            console.error('Erro ao gerar relatório de Check-in e Check-out:', error); // Log de erro
            res.status(500).json({ message: 'Erro ao gerar relatório de Check-in e Check-out', error: error.message });
        }
    }
    async Leads(req, res) {
        try {
            const relatorio = await ClienteModel.Leads(); 
            if (!relatorio || relatorio.length === 0) {
                return res.status(404).json({ message: 'Nenhum dado encontrado para o relatório.' });
            }
            res.json(relatorio);
        } catch (error) {
            console.error('Erro ao gerar relatório:', error); // Log de erro
            res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
        }
    }
    async ClientesPlanos(req, res) {
        try {
            const relatorio = await ClienteModel.ClientesPlanos(); 
            if (!relatorio || relatorio.length === 0) {
                return res.status(404).json({ message: 'Nenhum dado encontrado para o relatório.' });
            }
            res.json(relatorio);
        } catch (error) {
            console.error('Erro ao gerar relatório:', error); // Log de erro
            res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
        }
    }
    
}

module.exports = ClienteController;
