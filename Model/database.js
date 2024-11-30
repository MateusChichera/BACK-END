const mysql = require('mysql2/promise');

class Database {
  // Campo estático para armazenar a instância única
  static #instance;

  // Construtor privado: só pode ser chamado dentro da classe
  constructor() {
    if (Database.#instance) {
      throw new Error('Use Database.getInstance() para acessar a instância.');
    }

    this.pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'masterkey',
      database: 'projetofinal',
    });
  }

  // Método estático para acessar a instância única
  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  // Método para executar comandos SQL que retornam dados
  async executaComando(sql, params = []) {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query(sql, params);
      return rows;
    } finally {
      connection.release();
    }
  }

  // Método para executar comandos SQL que não retornam dados (INSERT, UPDATE, DELETE)
  async executaComandoNonQuery(sql, params = []) {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query(sql, params);
      return result; // Retorna o objeto completo, incluindo affectedRows
    } finally {
      connection.release();
    }
  }
}

module.exports = Database;