const Database = require("../database");

const db = new Database();

class AgendamentoModel {
    constructor({ 
        age_id = null, 
        cli_id = null, 
        sal_id = null, 
        age_data = null, 
        age_status = null,
        age_horario_inicio = null, 
        age_horario_fim = null,
        cli_nome = null,
        cli_razao = null,
        sal_nome = null 
    } = {}) {
        this.age_id = age_id;
        this.cli_id = cli_id;
        this.sal_id = sal_id;
        this.age_data = age_data;
        this.age_status = age_status;
        this.age_horario_inicio = age_horario_inicio;
        this.age_horario_fim = age_horario_fim;
        this.cli_nome = cli_nome;
        this.cli_razao = cli_razao;
        this.sal_nome = sal_nome;
    }

    // Verificar se a sala está disponível em um horário específico
    static async verificarDisponibilidade(sala_id, data, horarioInicio, horarioFim) {
        const sql = `
            SELECT *
            FROM agendamentos
            WHERE sal_id = ? 
            AND age_data = ? 
            AND (
                (age_horario_inicio < ? AND age_horario_fim > ?) OR 
                (age_horario_inicio < ? AND age_horario_fim > ?) OR 
                (age_horario_inicio >= ? AND age_horario_inicio < ?) OR 
                (age_horario_fim > ? AND age_horario_fim <= ?)
            )
        `;
        const params = [sala_id, data, horarioInicio, horarioFim, horarioInicio, horarioFim, horarioInicio, horarioFim, horarioInicio, horarioFim];
        const results = await db.executaComando(sql, params);
        return results.length === 0;
    }

    // Função para aprovar um agendamento, mudando o status
    static async aprovarAgendamento(age_id) {
        const sql = `UPDATE agendamentos SET age_status = 'aprovado' WHERE age_id = ?`;
        const params = [age_id];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.affectedRows > 0;
    }

    // Inserir um novo agendamento
    static async criar(agendamento) {
        const isDisponivel = await this.verificarDisponibilidade(agendamento.sal_id, agendamento.age_data, agendamento.age_horario_inicio, agendamento.age_horario_fim);
        
        if (!isDisponivel) {
            throw new Error("Sala já está agendada nesse horário.");
        }

        const sql = 'INSERT INTO agendamentos (cli_id, sal_id, age_data, age_horario_inicio, age_horario_fim) VALUES (?, ?, ?, ?, ?)';
        const params = [agendamento.cli_id, agendamento.sal_id, agendamento.age_data, agendamento.age_horario_inicio, agendamento.age_horario_fim];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.insertId ? new AgendamentoModel({ ...agendamento, age_id: result.insertId }) : null;
    }

    // Consultar todos os agendamentos
    static async ObterTodos() {
        const sql = `
            SELECT 
                a.age_id,
                a.cli_id,
                a.sal_id,
                a.age_data,
                a.age_status,
                a.age_horario_inicio,
                a.age_horario_fim,
                c.cli_nome, 
                c.cli_razao, 
                s.sal_nome 
            FROM agendamentos a
            LEFT JOIN clientes c ON a.cli_id = c.cli_id
            LEFT JOIN salas s ON a.sal_id = s.sal_id
        `;
        const results = await db.executaComando(sql);
        return results.map(row => new AgendamentoModel(row));
    }

    // Consultar um agendamento específico
    static async ObterPorId(age_id) {
        const sql = 'SELECT * FROM agendamentos WHERE age_id = ?';
        const params = [age_id];
        const results = await db.executaComando(sql, params);
        return results.length > 0 ? new AgendamentoModel(results[0]) : null;
    }

    // Excluir um agendamento
    static async Excluir(age_id) {
        const sql = 'DELETE FROM agendamentos WHERE age_id = ?';
        const params = [age_id];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.affectedRows > 0;
    }

    // Atualizar um agendamento existente
    static async editar(agendamento) {
        const isDisponivel = await this.verificarDisponibilidade(agendamento.sal_id, agendamento.age_data, agendamento.age_horario_inicio, agendamento.age_horario_fim);
        
        if (!isDisponivel) {
            throw new Error("Sala já está agendada nesse horário.");
        }

        const sql = `
            UPDATE agendamentos 
            SET cli_id = ?, 
                sal_id = ?, 
                age_data = ?, 
                age_horario_inicio = ?, 
                age_horario_fim = ? 
            WHERE age_id = ?`;
        
        const params = [
            agendamento.cli_id, 
            agendamento.sal_id, 
            agendamento.age_data, 
            agendamento.age_horario_inicio, 
            agendamento.age_horario_fim,
            agendamento.age_id
        ];
        
        const result = await db.executaComandoNonQuery(sql, params);
        return result.affectedRows > 0 ? new AgendamentoModel({ ...agendamento }) : null;
    }
}

module.exports = AgendamentoModel;
