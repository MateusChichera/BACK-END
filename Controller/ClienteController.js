const ClienteModel = require('../Model/entidades/Clientemodel');
const ReceitaWSService = require('../Model/entidades/BuscaCnpj');

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
            const dadosCNPJ = await ReceitaWSService.buscarCNPJ(cnpj);
            return res.status(200).json(dadosCNPJ);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar dados do CNPJ", error: error.message });
        }
    }

}

module.exports = ClienteController;
