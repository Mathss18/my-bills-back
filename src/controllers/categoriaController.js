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
        const categorias = await Categoria.findAll()

        if (categorias.length == 0)
            return erro(req, res, "Não existem Categorias cadastradas");

        return res.status(200).json(categorias)
    },

    async editar(req, res) {
        const { id } = req.params;
        let { descricao, cor } = req.body
        const categoria = await Categoria.findByPk(id);

        if (id == null)
            return erro(req, res, "Não foi possível atualizar a categoria " + id + ", categoria não encontrada");

        if (descricao == '' || descricao == null)
            return erro(req, res, "Não foi possível atualizar a categoria: descricao nula ou vazia");

        if (cor == '' || cor == null)
            return erro(req, res, "Não foi possível atualizar a categoria: cor nula ou vazia");

        categoria.descricao = descricao
        categoria.cor = cor

        const categoria_response = await categoria.save()
        return res.status(200).json(categoria_response)
    },

    async cadastrar(req, res) {
        let { descricao, cor, id_usuario } = req.body

        if (descricao == '' || descricao == null)
            return erro(req, res, "Não foi possível cadastrar a categoria: descricao nula ou vazia");

        if (cor == '' || cor == null)
            return erro(req, res, "Não foi possível cadastrar a categoria: cor nula ou vazia");

        if (id_usuario == '' || id_usuario == null)
            return erro(req, res, "Não foi possível cadastrar a categoria: id_usuario nulo ou vazio");

        const categoria = await Categoria.create({ descricao, cor, id_usuario })
        return res.status(200).json(categoria)
    },

    async excluir(req, res) {
        const { id } = req.params
        const categoria = await Categoria.findByPk(id)

        if (categoria == null)
            return erro(req, res, "Não foi possível excluir a categoria " + id + ", categoria não encontrada");

        const categoria_response =  await categoria.destroy()
        return res.status(200).json(categoria_response)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const categoria = await Categoria.findByPk(id)

        if (categoria == null)
            return erro(req, res, "Não foi possível recuperar os dados da categoria " + id + ", categoria não encontrada");

        return res.status(200).json(categoria)
    },
}