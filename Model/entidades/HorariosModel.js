const Database = require("../database");

const db = Database.getInstance();


class HorariosModel{
    constructor({hor_id= null, hor_tipo = '', hor_dias = '', hor_inicio = null, hor_fim = null}={}){
        this.hor_id = hor_id;
        this.hor_tipo = hor_tipo;
        this.hor_dias = hor_dias;
        this.hor_inicio = hor_inicio;
        this.hor_fim = hor_fim;

    }

    static async ObterTodos(){
        const sql = `SELECT * FROM horarios`
        const results = await db.executaComando(sql);
        return results.map(row => new HorariosModel(row));
    }
    static async ObterID(id){
        const sql = `SELECT * FROM horarios WHERE hor_id = ?`
        const results = await db.executaComando(sql,id);
        return results.map(row => new HorariosModel(row));
    }
    //BUSCA POR NOME
    static async ObterNome(nome){
        const sql = `SELECT * FROM horarios WHERE hor_tipo LIKE ? OR hor_dias LIKE ?`;
        const params = [`%${nome}%`, `%${nome}%`];
        const results = await db.executaComando(sql,params);
        if (results.length > 0) {
            return results.map(row => new HorariosModel(row)); // Mapeia os resultados para objetos
        } else {
            return null;
        }

    }
    static async Inserir(horario) {
        // Formata os dias da semana, se hor_dias não for vazio ou nulo
               // Adiciona vírgulas entre os dias da semana
               const diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'];
               let hor_dias = horario.hor_dias;
               diasSemana.forEach(dia => {
                   hor_dias = hor_dias.replace(dia, `,${dia}`);
               });
               hor_dias = hor_dias.startsWith(',') ? hor_dias.slice(1) : hor_dias;

               console.log("dentro da model", hor_dias);
        const sql = 'INSERT INTO horarios (hor_tipo, hor_dias, hor_inicio, hor_fim) VALUES (?, ?, ?, ?)';
        const params = [horario.hor_tipo, horario.hor_dias, horario.hor_inicio, horario.hor_fim];
        const result = await db.executaComandoNonQuery(sql, params);
        return horario; // Retorna o horario registrado
    }

    static async Atualizar(horario,id){
              // Adiciona vírgulas entre os dias da semana
              const diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'];
              let hor_dias = horario.hor_dias;
              diasSemana.forEach(dia => {
                  hor_dias = hor_dias.replace(dia, `,${dia}`);
              });
              hor_dias = hor_dias.startsWith(',') ? hor_dias.slice(1) : hor_dias;
        const sql ='UPDATE horarios set hor_tipo = ?, hor_dias = ?, hor_inicio =?, hor_fim = ? WHERE hor_id = ?'
        const params = [horario.hor_tipo,horario.hor_dias,horario.hor_inicio,horario.hor_fim,id];
        const result = await db.executaComandoNonQuery(sql,params);
        return result.affectedRows >0;
    }
    
    static async Excluir(hor_id){
        const sql = 'DELETE FROM horarios WHERE hor_id = ?'
        const result = await db.executaComandoNonQuery(sql,[hor_id]);
        return result.affectedRows > 0;
    }

}

module.exports = HorariosModel;
