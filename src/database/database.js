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

Usuario.init(connection)
Categoria.init(connection)
Banco.init(connection)
Conta.init(connection)

module.exports = connection;