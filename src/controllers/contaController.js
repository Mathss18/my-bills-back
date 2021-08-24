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
        const conta = await Conta.findAll()

        if (conta.length == 0)
            return erro(req, res, "Não existem Contas cadastradas");

        return res.status(200).json(conta)
    },
    
    async listarHomeChart(req, res) {
        const { id } = req.params
        const bancos = await Banco.findAll(
            {
                attributes: [
                    'id', 'nome'
                ],
                where: {
                    id_usuario: id
                }
            }
        );

        let contas_receber = [];
        let contas_pagar = [];
        let nomes_banco = [];

        for(let i = 0; i < bancos.length; i++){
            nomes_banco.push(bancos[i].dataValues.nome);
            contas_receber.push(await Conta.sum('valor', {
                where: {
                    start: { 
                        [Sequelize.Op.and]: {
                            [Sequelize.Op.gte]: moment().startOf('month').format('YYYY-MM-DD'), 
                            [Sequelize.Op.lte]: moment().endOf('month').format('YYYY-MM-DD')
                        }, 
                    },
                    tipo: 1,
                    situacao: 0,
                    id_banco: bancos[i].dataValues.id
                } 
            }))
            contas_pagar.push(await Conta.sum('valor', {
                where: {
                    start: { 
                        [Sequelize.Op.and]: {
                            [Sequelize.Op.gte]: moment().startOf('month').format('YYYY-MM-DD'), 
                            [Sequelize.Op.lte]: moment().endOf('month').format('YYYY-MM-DD')
                        }, 
                    },
                    tipo: 0,
                    situacao: 0,
                    id_banco: bancos[i].dataValues.id
                } 
            }))
        }

        const retorno = {
            nomes_banco,
            contas_receber,
            contas_pagar
        }

        return res.status(200).json(retorno)
    },
    
    async listarHome(req, res) {
        const { id } = req.params

        const conta_receber = await Conta.sum('valor', {
                where: {
                    start: moment().format('YYYY-MM-DD'),
                    tipo: 1,
                    situacao: 0,
                    id_usuario: id
                    }
                });

        const conta_pagar = await Conta.sum('valor', {
                where: {
                    start: moment().format('YYYY-MM-DD'),
                    tipo: 0,
                    situacao: 0,
                    id_usuario: id
                    }
                });

        const pagar = await Conta.sum('valor', {
            where: {
                start: { 
                    [Sequelize.Op.and]: {
                        [Sequelize.Op.gte]: moment().startOf('month').format('YYYY-MM-DD'), 
                        [Sequelize.Op.lte]: moment().endOf('month').format('YYYY-MM-DD')
                    }, 
                },
                tipo: 0,
                id_usuario: id
            } 
        });

        const receber = await Conta.sum('valor', {
            where: {
                start: { 
                    [Sequelize.Op.and]: {
                        [Sequelize.Op.gte]: moment().startOf('month').format('YYYY-MM-DD'), 
                        [Sequelize.Op.lte]: moment().endOf('month').format('YYYY-MM-DD')
                    }, 
                },
                tipo: 1,
                id_usuario: id
            } 
        });

        const retorno = {
            conta_receber,
            conta_pagar,
            dados_mes: {
                pagar,
                receber
            }
        }

        return res.status(200).json(retorno)
    },

    async editar(req, res) {
        const {id} = req.params;
        let { title, start, end, color, description, dataBaixa, valor, tipo, situacao, id_categoria, id_banco } = req.body
        const conta = await Conta.findByPk(id);

        if (conta == null)
            return erro(req, res, "Não foi possível atualizar a conta "+id+", conta não encontrada");

        if (title == '' || title == null)
            return erro(req, res, "Não foi possível atualizar a conta: title nula ou vazia");

        if (start == '' || start == null)
            return erro(req, res, "Não foi possível atualizar a conta: start nula ou vazia");

        if (color == '' || color == null)
            return erro(req, res, "Não foi possível atualizar a conta: color nula ou vazia");

        if (tipo == null)
            return erro(req, res, "Não foi possível atualizar a conta: tipo nula ou vazia");

        if (situacao == null)
            return erro(req, res, "Não foi possível atualizar a conta: situacao nula ou vazia");

        if (id_categoria == '' || id_categoria == null)
            return erro(req, res, "Não foi possível atualizar a conta: id_categoria nula ou vazia");

        if (id_banco == '' || id_banco == null)
            return erro(req, res, "Não foi possível atualizar a conta: id_banco nula ou vazia");

        if (valor == '' || valor == null)
            return erro(req, res, "Não foi possível atualizar a conta: valor nula ou vazia");

        if(situacao == 1 && conta.situacao == 1){
            if(id_banco != conta.id_banco){
                const banco_old = await Banco.findByPk(conta.id_banco);
                if(conta.tipo == 0){// se = pagar
                    banco_old.saldo += conta.valor;
                } else {// se = receber
                    banco_old.saldo -= conta.valor;
                }
                banco_old.save();
                
                const banco_new = await Banco.findByPk(id_banco);
                if(tipo == 0){// se = pagar
                    banco_new.saldo -= valor;
                } else {// se = receber
                    banco_new.saldo += valor;
                }
                banco_new.save();
            }else{
                if(conta.valor != valor){
                    const banco = await Banco.findByPk(id_banco);

                    if(valor > conta.valor){
                        const newValue = valor - conta.valor;
                        if(tipo == 0){// se = pagar
                            banco.saldo -= newValue;
                        } else {// se = receber
                            banco.saldo += newValue;
                        }
                    } else {
                        const newValue = conta.valor - valor;
                        if(tipo == 0){// se = pagar
                            banco.saldo += newValue;
                        } else {// se = receber
                            banco.saldo -= newValue;
                        }
                    }
                    banco.save();
                }
            }
        } else if(situacao == 0 && conta.situacao == 1){
            const banco = await Banco.findByPk(conta.id_banco);
            if(conta.tipo == 0){// se = pagar
                banco.saldo += conta.valor;
            } else {// se = receber
                banco.saldo -= conta.valor;
            }
            banco.save();
        } else if(situacao == 1 && conta.situacao == 0){
            const banco = await Banco.findByPk(id_banco);
            if(tipo == 0){// se = pagar
                banco.saldo -= valor;
            } else {// se = receber
                banco.saldo += valor;
            }
            banco.save();
        }

        conta.title = title
        conta.start = start
        conta.end = end
        conta.color = color
        conta.description = description
        conta.dataBaixa = dataBaixa
        conta.tipo = tipo
        conta.situacao = situacao
        conta.valor = valor
        conta.id_categoria = id_categoria
        conta.id_banco = id_banco

        const conta_response = await conta.save()
        return res.status(200).json(conta_response)
    },

    async cadastrar(req, res) {
        let { title, start, end, color, description, dataBaixa, valor, tipo, situacao, id_categoria, id_banco, id_usuario } = req.body

        if (title == '' || title == null)
            return erro(req, res, "Não foi possível cadastrar a conta: title nula ou vazia");

        if (valor == '' || valor == null)
            return erro(req, res, "Não foi possível cadastrar a conta: valor nula ou vazia");

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

        const conta = await Conta.create({ title, start, end, color, description, valor, dataBaixa, tipo, situacao, id_categoria, id_banco, id_usuario })

        if(situacao == 1){// se = finalizado
            const banco = await Banco.findByPk(id_banco);

            if(tipo == 0){// se = pagar
                banco.saldo = banco.saldo - valor;
            } else {// se = receber
                banco.saldo = banco.saldo + valor;
            }

            banco.save();
        }
        return res.status(200).json(conta)
    },

    async excluir(req, res) {
        const { id } = req.params
        const conta = await Conta.findByPk(id)

        if (conta == null)
            return erro(req, res, "Não foi possível excluir a conta "+id+", conta não encontrada");

        conta.destroy()
        return res.status(200).json(conta)
    },

    async listarEspecifico(req, res) {
        const { id } = req.params
        const conta = await Conta.findByPk(id)

        if (conta == null)
            return erro(req, res, "Não foi possível recuperar os dados da conta "+id+", conta não encontrada");

        return res.status(200).json(conta)
    },

    async listarContasUsuario(req, res) {
        const { id } = req.params
        const contas = await Conta.findAll({
                where: {
                    id_usuario: id
                } 
            })

        if (contas == null)
            return erro(req, res, "Não foi possível recuperar os dados das contas do usuario "+id+", contas não encontradas");

        return res.status(200).json(contas)
    },
}