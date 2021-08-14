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
        const Contas = await Conta.findAll()

        if (Contas.length == 0)
            return erro(req, res, "Não existem Contas cadastradas");

        return res.status(200).json(Bancos)
    },

    async editar(req, res) {
        const {id} = req.params;
        let { title, start, end, color, description, dataBaixa, tipo, situacao, id_categoria, id_banco } = req.body
        const Conta = await Conta.findByPk(id);

        if (Conta == null)
            return erro(req, res, "Não foi possível atualizar a conta "+id+", conta não encontrada");

        if (descricao == '' || descricao == null)
            return erro(req, res, "Não foi possível atualizar a conta: descricao nula ou vazia");

        if (cor == '' || cor == null)
            return erro(req, res, "Não foi possível atualizar a conta: cor nula ou vazia");

        Conta.title = title
        Conta.start = start
        Conta.end = end
        Conta.color = color
        Conta.description = description
        Conta.dataBaixa = dataBaixa
        Conta.tipo = tipo
        Conta.situacao = situacao
        Conta.id_categoria = id_categoria
        Conta.id_banco = id_banco

        const Conta_response = await Conta.save()
        return res.status(200).json(Banco_response)
    },

    async cadastrar(req, res) {
        let { title, start, end, color, description, dataBaixa, tipo, situacao, id_categoria, id_banco, id_usuario } = req.body

        if (start == '' || start == null)
            return erro(req, res, "Não foi possível cadastrar a conta: start nula ou vazia");

        if (color == '' || color == null)
            return erro(req, res, "Não foi possível cadastrar a conta: color nula ou vazia");

        if (tipo == '' || tipo == null)
            return erro(req, res, "Não foi possível cadastrar a conta: tipo nula ou vazia");

        if (situacao == '' || situacao == null)
            return erro(req, res, "Não foi possível cadastrar a conta: situacao nula ou vazia");

        if (id_categoria == '' || id_categoria == null)
            return erro(req, res, "Não foi possível cadastrar a conta: id_categoria nula ou vazia");

        if (id_banco == '' || id_banco == null)
            return erro(req, res, "Não foi possível cadastrar a conta: id_banco nula ou vazia");

        if (id_usuario == '' || id_usuario == null)
            return erro(req, res, "Não foi possível cadastrar a categoria: id_usuario nulo ou vazio");

        const Conta = await Conta.create({ title, start, end, color, description, dataBaixa, tipo, situacao, id_categoria, id_banco, id_usuario })
        return res.status(200).json(Conta)
    },

    async excluir(req, res) {
        const { id } = req.params
        const Conta = await Conta.findByPk(id)

        if (Conta == null)
            return erro(req, res, "Não foi possível excluir a conta "+id+", conta não encontrada");

        Conta.destroy()
        return res.status(200).json(Conta)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const Conta = await Conta.findByPk(id)

        if (Conta == null)
            return erro(req, res, "Não foi possível recuperar os dados da conta "+id+", conta não encontrada");

        return res.status(200).json(Conta)
    },
}