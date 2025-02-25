import mysql from 'mysql2/promise';
import dotenv from "dotenv";
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Ajuste conforme necessário
    queueLimit: 0
});

// Função otimizada para executar queries de forma segura
 async function executeQuery(query, params = []) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(query, params);
        return rows;
    } catch (error) {
        console.error('Erro ao executar a query:', error);
        throw error;
    } finally {
        connection.release(); // Evita vazamento de conexões
    }
}

async function getUser(data){
    try {
       const rows = await executeQuery("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [data.username, data.password]);
       return rows[0];
    } catch (error) {
        console.log(error);
    }
}

async function novaConfig(data) {
    try {
        const query = "INSERT INTO configs (email, nome, config) VALUES (?, ?, ?)";
        const params = [data.email, data.nome, data.config];
        await executeQuery(query, params);
        return "OK";
    } catch (error) {
        console.log(error);
    }
}

async function updateConfig(index, data) {
    console.log(data);
    try {
        // Define a consulta UPDATE
        const query = "UPDATE configs SET nome = ?, config = ? WHERE id = ?";
        const params = [data.name, data, index]; // Define os parâmetros que serão passados para a consulta

        // Executa a consulta com os parâmetros 
        await executeQuery(query, params);

        return true;
    } catch (error) {
        console.log(error);
        return "Erro ao atualizar configurações";
    }
}

async function deleteConfig(data) {
try {
    const query  = "DELETE FROM configs WHERE id = ?";
    const params = [data];
    await executeQuery(query, params);
} catch (error) {
    console.log(error);
}
}

async function getConfigs(){
    try {
       const rows = await executeQuery("SELECT * FROM configs");
       return rows;
    } catch (error) {
        console.log(error);
    }
}
export {
    executeQuery,
    getUser,
    novaConfig,
    updateConfig,
    getConfigs,
    deleteConfig
}
