const Conta = require('../models/conta')
const Banco = require('../models/banco')
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const moment = require('moment');

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
    
    async relatorio(req, res) {
        const bancos = await Banco.findAll();

        for(let i = 0; i < bancos.length; i++){
            let pagar = await Conta.sum('valor', {
                where: {
                    start: { 
                        [Sequelize.Op.and]: {
                            [Sequelize.Op.gt]: moment().format('YYYY-MM-DD'), 
                        }, 
                    },
                    tipo: 0,
                    id_banco: bancos[i].dataValues.id
                } 
            });
            let receber = await Conta.sum('valor', {
                where: {
                    start: { 
                        [Sequelize.Op.and]: {
                            [Sequelize.Op.gt]: moment().format('YYYY-MM-DD'), 
                        }, 
                    },
                    tipo: 1,
                    id_banco: bancos[i].dataValues.id
                } 
            })
            bancos[i].dataValues.saldo_previsto = bancos[i].dataValues.saldo + receber - pagar;
            let pagar_mes = await Conta.sum('valor', {
                where: {
                    start: { 
                        [Sequelize.Op.and]: {
                            [Sequelize.Op.gt]: moment().format('YYYY-MM-DD'), 
                            [Sequelize.Op.lte]: moment().add(1, 'months').format('YYYY-MM-DD'),
                        }, 
                    },
                    tipo: 0,
                    id_banco: bancos[i].dataValues.id
                } 
            });
            let receber_mes = await Conta.sum('valor', {
                where: {
                    start: { 
                        [Sequelize.Op.and]: {
                            [Sequelize.Op.gt]: moment().format('YYYY-MM-DD'), 
                            [Sequelize.Op.lte]: moment().add(1, 'months').format('YYYY-MM-DD'), 
                        }, 
                    },
                    tipo: 1,
                    id_banco: bancos[i].dataValues.id
                } 
            })
            bancos[i].dataValues.saldo_mes = bancos[i].dataValues.saldo + receber_mes - pagar_mes;
        }

        return res.status(200).json(bancos)
    },
}