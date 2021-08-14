const express = require('express');
const UsuarioController = require('./controllers/usuarioController.js')
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
        console.log(decoded);
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
    BancoController.listar
})

routes.get('/bancos/:id', verifyJWT, (req, res) => {
    BancoController.listarEspecifico(req, res)
})
// ======================= Cadastrar/Editar ===================
routes.post('/bancos', verifyJWT, (req, res) => {
    BancoController.cadastrar
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
    CategoriaController.listar
})

routes.get('/categorias/:id', verifyJWT, (req, res) => {
    CategoriaController.listarEspecifico(req, res)
})
// ======================= Cadastrar/Editar ===================
routes.post('/categorias', verifyJWT, (req, res) => {
    CategoriaController.cadastrar
})

routes.put('/categorias/:id', verifyJWT, (req, res) => {
    CategoriaController.editar(req, res)
})
// ======================= Deletar ===================
routes.delete('/categorias/:id', verifyJWT, (req, res) => {
    CategoriaController.excluir(req, res)
})

module.exports = routes;