const HorariosModel = require('../Model/entidades/HorariosModel');

class HorariosController{

    async Obter(req,res){
        try{    const horario = await HorariosModel.ObterTodos();
                return res.status(200).json(horario);

        }catch(error){
            return res.status(500).json({message: "Erro ao obter horarios", error:error.message});
        }
    }
    async ObterID(req,res){
        try{    
            const {id} = req.params;
            const horario = await HorariosModel.ObterID(id);
                return res.status(200).json(horario);

        }catch(error){
            return res.status(500).json({message: "Erro ao obter horarios", error:error.message});
        }
    }
    //BUSCA POR DIAS OU TIPO(NOME)
    async ObterNome(req,res){
        try{    
            const nome = req.params.busca;

            const horario = await HorariosModel.ObterNome(nome);
                return res.status(200).json(horario);

        }catch(error){
            return res.status(500).json({message: "Erro ao buscar horarios", error:error.message});
        }
    }
    async Inserir(req,res){
        try{    
            const horario= new HorariosModel(req.body);
            console.log(horario);

            const HorarioInserido = await HorariosModel.Inserir(horario);
            return res.status(200).json(HorarioInserido);

        }catch(error){
            return res.status(500).json({message:"Erro ao inserir horario", error:error.message});
        }

    }

    async Atualizar(req,res){
        try{
            const {id} = req.params;
            const horario = new HorariosModel(req.body);
            const HorarioAtualizado = await HorariosModel.Atualizar(horario,id);
            return res.status(200).json({message:"Horario atualizado com sucesso"});
        }catch(error)
        {
            return res.status(500).json({message:"Erro ao atualizar horario", error:error.message});
        }
    }

    async Excluir(req,res){
        try{    const {id} = req.params;
                const excluir = await HorariosModel.Excluir(id);
                return res.status(200).json({message:"horario excluido com sucesso"});

        }catch(error){
            return res.status(500).json({message:"Erro ao excluir horario",error:error.message});
        }
    }

}

module.exports = HorariosController;