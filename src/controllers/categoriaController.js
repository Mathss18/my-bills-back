const Categoria = require('../models/categoria')
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
        const Categorias = await Categoria.findAll()

        if (Categorias.length == 0)
            return erro(req, res, "Não existem Categorias cadastradas");

        return res.status(200).json(Bancos)
    },

    async editar(req, res) {
        const {id} = req.params;
        let { descricao, cor } = req.body
        const Categoria = await Categoria.findByPk(id);

        if (Categoria == null)
            return erro(req, res, "Não foi possível atualizar a categoria "+id+", categoria não encontrada");

        if (descricao == '' || descricao == null)
            return erro(req, res, "Não foi possível atualizar a categoria: descricao nula ou vazia");

        if (cor == '' || cor == null)
            return erro(req, res, "Não foi possível atualizar a categoria: cor nula ou vazia");

        Categoria.descricao = descricao
        Categoria.cor = cor

        const Categoria_response = await Categoria.save()
        return res.status(200).json(Banco_response)
    },

    async cadastrar(req, res) {
        let { descricao, cor, id_usuario } = req.body

        if (descricao == '' || descricao == null)
            return erro(req, res, "Não foi possível cadastrar a categoria: descricao nula ou vazia");

        if (cor == '' || cor == null)
            return erro(req, res, "Não foi possível cadastrar a categoria: cor nula ou vazia");

        if (id_usuario == '' || id_usuario == null)
            return erro(req, res, "Não foi possível cadastrar a categoria: id_usuario nulo ou vazio");

        const Categoria = await Categoria.create({ descricao, cor, id_usuario })
        return res.status(200).json(Categoria)
    },

    async excluir(req, res) {
        const { id } = req.params
        const Categoria = await Categoria.findByPk(id)

        if (Categoria == null)
            return erro(req, res, "Não foi possível excluir a categoria "+id+", categoria não encontrada");

        Categoria.destroy()
        return res.status(200).json(Categoria)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const Categoria = await Categoria.findByPk(id)

        if (Categoria == null)
            return erro(req, res, "Não foi possível recuperar os dados da categoria "+id+", categoria não encontrada");

        return res.status(200).json(Categoria)
    },
}