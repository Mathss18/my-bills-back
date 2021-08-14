const Banco = require('../models/banco')
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
        const Bancos = await Banco.findAll()

        if (Bancos.length == 0)
            return erro(req, res, "Não existem bancos cadastrados");

        return res.status(200).json(Bancos)
    },

    async editar(req, res) {
        const {id} = req.params;
        let { nome, saldo, logo } = req.body
        const Banco = await Banco.findByPk(id);

        if (Banco == null)
            return erro(req, res, "Não foi possível atualizar o  Banco "+id+", banco não encontrado");

        if (nome == '' || nome == null)
            return erro(req, res, "Não foi possível atualizar o banco: nome nulo ou vazio");

        if (saldo == '' || saldo == null)
            return erro(req, res, "Não foi possível atualizar o banco: saldo nulo ou vazio");

        if (logo == '' || logo == null)
            return erro(req, res, "Não foi possível atualizar o banco: logo nulo ou vazio");

        Banco.nome = nome
        Banco.saldo = saldo
        Banco.logo = logo

        const Banco_response = await Banco.save()
        return res.status(200).json(Banco_response)
    },

    async cadastrar(req, res) {
        let { nome, saldo, logo, id_usuario } = req.body

        if (nome == '' || nome == null)
            return erro(req, res, "Não foi possível cadastrar o banco: nome nulo ou vazio");

        if (saldo == '' || saldo == null)
            return erro(req, res, "Não foi possível cadastrar o banco: saldo nulo ou vazio");

        if (logo == '' || logo == null)
            return erro(req, res, "Não foi possível cadastrar o banco: logo nulo ou vazio");

        if (id_usuario == '' || id_usuario == null)
            return erro(req, res, "Não foi possível cadastrar o banco: id_usuario nulo ou vazio");

        const Banco = await Banco.create({ nome, saldo, logo, id_usuario })
        return res.status(200).json(Banco)
    },

    async excluir(req, res) {
        const { id } = req.params
        const Banco = await Banco.findByPk(id)

        if (Banco == null)
            return erro(req, res, "Não foi possível excluir o banco "+id+", banco não encontrado");

        Banco.destroy()
        return res.status(200).json(Banco)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const Banco = await Banco.findByPk(id)

        if (Banco == null)
            return erro(req, res, "Não foi possível recuperar os dados do banco "+id+", banco não encontrado");

        return res.status(200).json(Banco)
    },
}