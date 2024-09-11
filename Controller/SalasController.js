const SalasModel = require('../Model/entidades/Salasmodels');

class SalasController{

    async Obter(req,res){
        try{
            const sala = await SalasModel.ObterTodos();
            return res.status(200).json(sala);
        }catch(error){
            return res.status(500).json({message:"Erro ao obter salas", error: error.message});
        }
    }
    async ObterID(req,res){
        try{
            const {id} =req.params;
            const sala = await SalasModel.ObterID(id);
            return res.status(200).json(sala);
        }catch(error){
            return res.status(500).json({message:"Erro ao obter salas", error: error.message});
        }
    }
    async ObterNome(req,res){
        try{
            const nome =req.params.busca;
            const sala = await SalasModel.ObterNome(nome);
            return res.status(200).json(sala);
        }catch(error){
            return res.status(500).json({message:"Erro ao buscar salas", error: error.message});
        }
    }
    async Inserir(req,res){
        try{
                const sala = new SalasModel(req.body);
                console.log("DENTRO DA CONTROLLER",sala);
                const salaInserida = await SalasModel.Inserir(sala);
                return res.status(200).json(salaInserida);

        }catch(error){
            return res.status(500).json({message:"Erro ao inserir sala", error:error.message});
        }
    }

    async Atualizar(req,res){
        try{   const {id} = req.params;
            const sala = new SalasModel(req.body);
            const SalaAtualizada = await SalasModel.Atualizar(sala,id);
            return res.status(200).json({message:"Sala Atualizada com sucesso"});
        }catch(error){
            return res.status(500).json({ message: "Erro ao atualizar sala", error: error.message });

        }
    }

    async Excluir(req,res){
        try{
                const {id} = req.params;
                const excluir = await SalasModel.Excluir(id);
                return res.status(200).json({message:"Sala excluida com sucesso!"})

        }catch(error){
            return res.status(500).json({message:"Erro ao excluir sala", error: error.message});

        }

    }


}

module.exports = SalasController;