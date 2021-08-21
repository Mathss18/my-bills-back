const Squelize = require('sequelize');

const Usuario = require('../models/usuario')
const Categoria = require('../models/categoria')
const Banco = require('../models/banco')
const Conta = require('../models/conta')

const connection = new Squelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'mybills',
    define: {
        timestamps: false,
    },

});

Banco.init(connection)
Categoria.init(connection)
Conta.init(connection)
Usuario.init(connection)


module.exports = connection;