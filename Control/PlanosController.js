const PlanosModel = require('../Model/entidades/PlanosModels');

class PlanosController{

    async Obter(req,res){
        try{    
            const plano = await PlanosModel.ObterTodos();
            return res.status(200).json(plano);

        }catch(error){
            return res.status(500).json({message:"Erro ao obter planos",error:error.message});
        }}

        async ObterID(req,res){
            try{    
                const {id} = req.params;
                const plano = await PlanosModel.ObterID(id);
                return res.status(200).json(plano);
    
            }catch(error){
                return res.status(500).json({message:"Erro ao obter planos",error:error.message});
            }}
            async ObterNome(req,res){
                try{    
                    const id = req.params.busca;
                    const plano = await PlanosModel.ObterNome(id);
                    return res.status(200).json(plano);
        
                }catch(error){
                    return res.status(500).json({message:"Erro ao buscar planos",error:error.message});
                }}
    async Inserir(req,res){
        try{
                const plano = new PlanosModel(req.body)
                console.log("dentro da controller",plano);

                const PlanoInserido = await PlanosModel.Inserir(plano);
                return res.status(200).json(PlanoInserido);
        }catch(error){
            return res.status(500).json({message:"Erro ao inserir plano", error:error.message});
        }}

    async Atualizar(req,res){
        try{    
            const {id} = req.params;
            const plano = new PlanosModel(req.body);
            console.log("ID:",id);
            console.log("Plano",plano);
            const PlanoAtualizado = await PlanosModel.Atualizar(plano,id);
            return res.status(200).json({ message: "Plano atualizado com sucesso"});

        }catch(error){
            return res.status(500).json({message:"Erro ao atualizar plano", error:error.message});

        }}   
     async Excluir (req,res){
        try{
            const {id}= req.params;
            const excluir = await PlanosModel.Excluir(id);
            return res.status(200).json({message:"Plano excluido com sucesso!"});
        }catch(error){
            return res.status(500).json({message:"Erro ao excluir plano",error:error.message});
        }

        
     }

}

module.exports = PlanosController;