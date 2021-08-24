const Conta = require('../models/conta')
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
        const conta = await Conta.findAll()

        if (conta.length == 0)
            return erro(req, res, "Não existem Contas cadastradas");

        return res.status(200).json(conta)
    },

    async editar(req, res) {
        const { id } = req.params;
        let { title, start, end, color, description, dataBaixa, tipo, situacao, id_categoria, id_banco } = req.body
        const conta = await Conta.findByPk(id);

        if (conta == null)
            return erro(req, res, "Não foi possível atualizar a conta " + id + ", conta não encontrada");

        if (title == '' || title == null)
            return erro(req, res, "Não foi possível atualizar a conta: title nula ou vazia");

        if (start == '' || start == null)
            return erro(req, res, "Não foi possível atualizar a conta: start nula ou vazia");

        if (end == '' || end == null)
            return erro(req, res, "Não foi possível atualizar a conta: end nula ou vazia");

        if (color == '' || color == null)
            return erro(req, res, "Não foi possível atualizar a conta: color nula ou vazia");

        if (description == '' || description == null)
            return erro(req, res, "Não foi possível atualizar a conta: description nula ou vazia");

        if (dataBaixa == '' || dataBaixa == null)
            return erro(req, res, "Não foi possível atualizar a conta: dataBaixa nula ou vazia");

        if (tipo == '' || tipo == null)
            return erro(req, res, "Não foi possível atualizar a conta: tipo nula ou vazia");

        if (situacao == '' || situacao == null)
            return erro(req, res, "Não foi possível atualizar a conta: situacao nula ou vazia");

        if (id_categoria == '' || id_categoria == null)
            return erro(req, res, "Não foi possível atualizar a conta: id_categoria nula ou vazia");

        if (id_banco == '' || id_banco == null)
            return erro(req, res, "Não foi possível atualizar a conta: id_banco nula ou vazia");

        conta.title = title
        conta.start = start
        conta.end = end
        conta.color = color
        conta.description = description
        conta.dataBaixa = dataBaixa
        conta.tipo = tipo
        conta.situacao = situacao
        conta.id_categoria = id_categoria
        conta.id_banco = id_banco

        const conta_response = await conta.save()
        return res.status(200).json(conta_response)
    },

    async cadastrar(req, res) {
        let { title, start, end, color, description, dataBaixa, tipo, situacao, id_categoria, id_banco, id_usuario } = req.body

        if (title == '' || title == null)
            return erro(req, res, "Não foi possível cadastrar a conta: title nula ou vazia");

        if (start == '' || start == null)
            return erro(req, res, "Não foi possível cadastrar a conta: start nula ou vazia");

        if (color == '' || color == null)
            return erro(req, res, "Não foi possível cadastrar a conta: color nula ou vazia");

        if (tipo == null)
            return erro(req, res, "Não foi possível cadastrar a conta: tipo nula ou vazia");

        if (situacao == null)
            return erro(req, res, "Não foi possível cadastrar a conta: situacao nula ou vazia");

        if (id_categoria == '' || id_categoria == null)
            return erro(req, res, "Não foi possível cadastrar a conta: id_categoria nula ou vazia");

        if (id_banco == '' || id_banco == null)
            return erro(req, res, "Não foi possível cadastrar a conta: id_banco nula ou vazia");

        if (id_usuario == '' || id_usuario == null)
            return erro(req, res, "Não foi possível cadastrar a conta: id_usuario nula ou vazia");

        const conta = await Conta.create({ title, start, end, color, description, dataBaixa, tipo, situacao, id_categoria, id_banco, id_usuario })
        return res.status(200).json(conta)
    },

    async excluir(req, res) {
        const { id } = req.params
        const conta = await Conta.findByPk(id)

        if (conta == null)
            return erro(req, res, "Não foi possível excluir a conta " + id + ", conta não encontrada");

        conta.destroy()
        return res.status(200).json(conta)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const conta = await Conta.findByPk(id)

        if (conta == null)
            return erro(req, res, "Não foi possível recuperar os dados da conta " + id + ", conta não encontrada");

        return res.status(200).json(conta)
    },
}