const Usuario = require('../models/usuario')
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');

const sequelize = new Sequelize('mybills', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

function erro(req, res, msg) {
    return res.status(401).json({ mensagem: msg })
}

module.exports = {
    async listar(req, res) {
        const usuarios = await Usuario.findAll()

        if (usuarios.length == 0)
            return erro(req, res, "Não existem usuários cadastrados");

        return res.status(200).json(usuarios)
    },

    async editar(req, res) {
        const {id} = req.params;
        let { nome, email, senha } = req.body
        let foto = 'public/uploads/'+req.file.filename
        const usuario = await Usuario.findByPk(id);

        if (usuario == null)
            return erro(req, res, "Não foi possível atualizar o usuário"+id+", usuário não encontrado");

        if (nome == '' || nome == null)
            return erro(req, res, "Não foi possível atualizar o usuário: nome nulo ou vazio");

        if (email == '' || email == null)
            return erro(req, res, "Não foi possível atualizar o usuário: email nulo ou vazio");

        if (senha == '' || senha == null)
            return erro(req, res, "Não foi possível atualizar o usuário: senha nulo ou vazio");

        usuario.nome = nome
        usuario.email = email
        usuario.senha = senha
        usuario.foto = foto

        const usuario_response = await usuario.save()
        return res.status(200).json(usuario_response)
    },

    async cadastrar(req, res) {
        let { nome, email, senha } = req.body
        let foto = 'public/uploads/'+req.file.filename

        if (nome == '' || nome == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: nome nulo ou vazio");

        if (email == '' || email == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: email nulo ou vazio");

        if (senha == '' || senha == null)
            return erro(req, res, "Não foi possível cadastrar o usuário: senha nulo ou vazio");

        const usuario = await Usuario.create({ nome, email, senha, foto })
        return res.status(200).json(usuario)
    },

    async excluir(req, res) {
        const { id } = req.params
        const usuario = await Usuario.findByPk(id)

        if (usuario == null)
            return erro(req, res, "Não foi possível excluir o usuário"+id+", usuário não encontrado");

        usuario.destroy()
        return res.status(200).json(usuario)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const usuario = await Usuario.findByPk(id)

        if (usuario == null)
            return erro(req, res, "Não foi possível recuperar os dados do usuário "+id+", usuário não encontrado");

        return res.status(200).json(usuario)
    },

    async login(req, res) {
        let { email, senha } = req.body
        
        const usuario = await sequelize.query("SELECT id, nome, email, foto FROM usuario WHERE email = '" + email + "' AND senha = '" + senha + "';", { type: sequelize.QueryTypes.SELECT });

        let token = '';

        if (usuario.length == 0)
            return erro(req, res, "Falha ao autenticar");

        token = jwt.sign({ ...usuario[0] }, 'segredo', {
            expiresIn: 86400 // expires in 1 day
        });

        return res.status(200).json({
            "token": token,
            "usuario": usuario[0]
        })
    },

    async logout(req, res) {
        return res.status(204).send()
    },



}

