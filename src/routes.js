const express = require('express');
const UsuarioController = require('./controllers/usuarioController.js')
const BancoController = require('./controllers/bancoController.js')
const ContaController = require('./controllers/ContaController.js')
const CategoriaController = require('./controllers/CategoriaController.js')
const jwt = require('jsonwebtoken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage })

const routes = express.Router()

function erro(req, res, msg) {
    return res.status(401).json({ mensagem: msg })
}

function verifyJWT(req, res, next) {
    const token = req.headers['token'];
    if (!token) return erro(req, res, "Falha ao autorizar - token não enviado");

    jwt.verify(token, 'segredo', function (err, decoded) {
        if (err) return erro(req, res, "Falha ao autorizar - token inválido");

        // se tudo estiver ok, salva no request para uso posterior
        //console.log(decoded);
        next();
    });
}

// ======================= HOME ==============================
routes.get('/', (req, res) => {
    return res.json({ mensagem: 'Funcionou' })
});

// ======================= Usuarios ==============================
// ======================= Login ==============================
routes.post('/login', UsuarioController.login);

routes.post('/logout', verifyJWT, (req, res) => {
    UsuarioController.logout(req, res)
})
// ======================= Listar =============================
routes.get('/usuarios', UsuarioController.listar);

routes.get('/usuarios/:id', verifyJWT, (req, res) => {
    UsuarioController.listarEspecifico(req, res)
})

// ======================= Cadastrar/Editar ===================
routes.post('/usuarios', upload.single('foto'), UsuarioController.cadastrar);

routes.put('/usuarios/:id', [upload.single('foto'), verifyJWT], (req, res) => {
    UsuarioController.editar(req, res)
})
// ======================= Deletar ===================
routes.delete('/usuarios/:id', verifyJWT, (req, res) => {
    UsuarioController.excluir(req, res)
})

// ======================= Bancos ===============================
// ======================= Listar =============================
routes.get('/bancos', verifyJWT, (req, res) => {
    BancoController.listar(req, res)
})

routes.get('/bancos/:id', verifyJWT, (req, res) => {
    BancoController.listarEspecifico(req, res)
})

routes.get('/bancos/usuarios/:id', verifyJWT, (req, res) => {
    BancoController.listarBancosUsuario(req, res)
})
// ======================= Cadastrar/Editar ===================
routes.post('/bancos', verifyJWT, (req, res) => {
    BancoController.cadastrar(req, res)
})

routes.put('/bancos/:id', verifyJWT, (req, res) => {
    BancoController.editar(req, res)
})
// ======================= Deletar ===================
routes.delete('/bancos/:id', verifyJWT, (req, res) => {
    BancoController.excluir(req, res)
})

// ======================= Categorias ============================
// ======================= Listar =============================
routes.get('/categorias', verifyJWT, (req, res) => {
    CategoriaController.listar(req, res)
})

routes.get('/categorias/:id', verifyJWT, (req, res) => {
    CategoriaController.listarEspecifico(req, res)
})

routes.get('/categorias/usuarios/:id', verifyJWT, (req, res) => {
    CategoriaController.listarCategoriasUsuario(req, res)
})
// ======================= Cadastrar/Editar ===================
routes.post('/categorias', verifyJWT, (req, res) => {
    CategoriaController.cadastrar(req, res)
})

routes.put('/categorias/:id', verifyJWT, (req, res) => {
    CategoriaController.editar(req, res)
})
// ======================= Deletar ===================
routes.delete('/categorias/:id', verifyJWT, (req, res) => {
    CategoriaController.excluir(req, res)
})

// ======================= Contas ============================
// ======================= Listar =============================
routes.get('/contas', verifyJWT, (req, res) => {
    ContaController.listar(req, res)
})

routes.get('/contas/home/:id', verifyJWT, (req, res) => {
    ContaController.listarHome(req, res)
})

routes.get('/contas/home/chart/:id', verifyJWT, (req, res) => {
    ContaController.listarHomeChart(req, res)
})

routes.get('/contas/:id', verifyJWT, (req, res) => {
    ContaController.listarEspecifico(req, res)
})

routes.get('/contas/usuarios/:id', verifyJWT, (req, res) => {
    ContaController.listarContasUsuario(req, res)
})
// ======================= Cadastrar/Editar ===================
routes.post('/contas', verifyJWT, (req, res) => {
    ContaController.cadastrar(req, res)
})

routes.put('/contas/:id', verifyJWT, (req, res) => {
    ContaController.editar(req, res)
})
// ======================= Deletar ===================
routes.delete('/contas/:id', verifyJWT, (req, res) => {
    ContaController.excluir(req, res)
})

// ======================= Relatorio ==========================
// ======================= Listar =============================
routes.get('/relatorio/:id', verifyJWT, (req, res) => {
    BancoController.relatorio(req, res)
})

module.exports = routes;