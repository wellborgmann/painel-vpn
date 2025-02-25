import express from 'express';
import http from 'http';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import bcrypt from 'bcrypt'; // Para criptografar a senha
import { fileURLToPath } from 'url';
import path from 'path';
import { getUser, novaConfig, getConfigs, updateConfig, deleteConfig, sessionStore } from './app/banco.js';
import { proxySSH } from './app/referencia.js';
import dotenv from "dotenv";
const app = express();
const server = http.createServer(app);

// Middleware para parser JSON e sessão...
app.use(express.json());

// Configuração do armazenamento de sessão no MySQL


// Configuração da sessão
const sessionMiddleware = session({
    secret: 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,  // Usa MySQL para armazenar sessões
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Apenas HTTPS em produção
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
});
app.use(sessionMiddleware);

// Definição do caminho absoluto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rotas HTTP
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

// Rota de login (POST) com bcrypt
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Requisição de login:', req.body);

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    try {
        const user = await getUser(username);
        if (user && password === user.senha) { // Comparação com bcrypt
            req.session.user = { email: user.email };
            console.log('Sessão criada:', req.session.user);
            return res.redirect('/home');
        } else {
            return res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota protegida /home
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'views', 'home.html'));
    } else {
        res.redirect("/"); // Redireciona para o login
    }
});

// Cadastrar nova configuração
app.post('/cadastrar', async (req, res) => {
    const data = req.body;

    if (!data.connectionName) {
        return res.status(400).json({ message: "Nome da conexão é obrigatório" });
    }

    let config = { ...proxySSH, ...data };
    const user = {
        email: "wellborgmann@gmail.com",
        nome: data.connectionName,
        config: JSON.stringify(config)
    };
    try {
        await novaConfig(user);
        res.json({ message: "Configuração cadastrada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao cadastrar configuração" });
    }
});

// Buscar configurações
app.get('/configs', async (req, res) => {
    try {
        const configs = await getConfigs();
        res.json(configs);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar configurações" });
    }
});

// Editar configuração
app.post('/editar', async (req, res) => {
    const { index, ...data } = req.body;

    if (index === undefined) {
        return res.status(400).json({ message: "Índice da configuração é obrigatório" });
    }

    try {
        let editado = Object.assign({}, proxySSH, data);
        await updateConfig(index, editado);
        res.json({ message: "Configuração editada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao editar configuração" });
    }
});

// Excluir configuração
app.post('/excluir', async (req, res) => {
    const { index } = req.body;

    if (index === undefined) {
        return res.status(400).json({ message: "Índice da configuração é obrigatório" });
    }

    try {
        await deleteConfig(index);
        res.json({ message: "Configuração excluída com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao excluir configuração" });
    }
});

server.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});
