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
        const { id } = req.params;
        let { nome, saldo, logo } = req.body
        const banco = await Banco.findByPk(id);

        if (id == null)
            return erro(req, res, "Não foi possível atualizar o  Banco " + id + ", banco não encontrado");

        if (nome == '' || nome == null)
            return erro(req, res, "Não foi possível atualizar o banco: nome nulo ou vazio");

        if (saldo == '' || saldo == null)
            return erro(req, res, "Não foi possível atualizar o banco: saldo nulo ou vazio");

        if (logo == '' || logo == null)
            return erro(req, res, "Não foi possível atualizar o banco: logo nulo ou vazio");

        banco.nome = nome
        banco.saldo = saldo
        banco.logo = logo

        const bancoResponse = await banco.save()
        return res.status(200).json(bancoResponse)
    },

    async cadastrar(req, res) {
        //let logo = 'public/uploads/'+req.file.filename
        let { nome, saldo, logo, id_usuario } = req.body

        if (nome == '' || nome == null)
            return erro(req, res, "Não foi possível cadastrar o banco: nome nulo ou vazio");

        if (saldo == '' || saldo == null)
            return erro(req, res, "Não foi possível cadastrar o banco: saldo nulo ou vazio");

        if (logo == '' || logo == null)
            return erro(req, res, "Não foi possível cadastrar o banco: logo nulo ou vazio");

        if (id_usuario == '' || id_usuario == null)
            return erro(req, res, "Não foi possível cadastrar o banco: id_usuario nulo ou vazio");

        const banco = await Banco.create({ nome, saldo, logo, id_usuario })
        return res.status(200).json(banco)
    },

    async excluir(req, res) {
        const { id } = req.params
        const banco = await Banco.findByPk(id)

        if (banco == null)
            return erro(req, res, "Não foi possível excluir o banco " + id + ", banco não encontrado");

        const banco_response = await banco.destroy()
        return res.status(200).json(banco_response)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const banco = await Banco.findByPk(id)

        if (banco == null)
            return erro(req, res, "Não foi possível recuperar os dados do banco " + id + ", banco não encontrado");

        return res.status(200).json(banco)
    },
}