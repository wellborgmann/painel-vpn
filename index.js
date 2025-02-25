import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import socketIoSession from 'socket.io-express-session';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt';
import { getUser, novaConfig, getConfigs, updateConfig, deleteConfig } from './app/banco.js';
import { proxySSH } from './app/referencia.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware para parser JSON e sessão
app.use(express.json());

// Configuração do middleware de sessão
const sessionMiddleware = session({
    secret: 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
});

// Aplica o middleware de sessão no Express
app.use(sessionMiddleware);

// Aplica o middleware de sessão no Socket.IO
io.use(socketIoSession(sessionMiddleware));



// Definição do caminho absoluto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rotas HTTP
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

// Rota de login (POST)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Requisição de login:', req.body);

    try {
        const user = await getUser(req.body);


        if (user) {
            req.session.user = { email: user.email };
            console.log('Sessão criada:', req.session.user);
            return res.redirect('/home'); // Redireciona para a página protegida
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
        res.redirect("/")
    }
});

// Conexão do Socket.IO
io.on('connection', async (socket) => {


    socket.on("cadastrar", async (data) => {
        let config = proxySSH;
        config.name = data.connectionName;
        config.server.host = data.serverHost;
        config.server.port = data.serverPort;

        config.proxy.host = data.proxyHost;
        config.proxy.port = data.proxyPort;
        config.config_payload.payload = data.payload;
        const user = {
            email: "wellborgmann@gmail.com",
            nome: data.connectionName,
            config: JSON.stringify(config)
        }

        try {
            await novaConfig(user);
        } catch (error) {
            console.log(error);
            return
        }
        console.log("sucesso");
    })

    try {
        const configs = await getConfigs();
        if (configs.length > 0) {
            socket.emit("configs", configs);
        }
    } catch (error) {

    }

    socket.on("editar", async (data) => {
        try {

            const editado = proxySSH;
            editado.name = data.connectionName;
            editado.server.host = data.serverHost;
            editado.server.port = data.serverPort;
            editado.proxy.host = data.proxyHost;
            editado.proxy.port = data.proxyPort;
            editado.config_payload.payload = data.payload;
            await updateConfig(data.index, editado);
        } catch (error) {
            console.log(data);
        }
    })

    socket.on("excluir",async (data)=>{
        try {
           await  deleteConfig(data);
        } catch (error) {
            console.log(error)
        }
    })



    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

server.listen(4000, () => {
    console.log('Servidor rodando na porta 4000');
});
