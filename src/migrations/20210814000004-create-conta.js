'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('conta', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      start: {
        type: Sequelize.STRING
      },
      end: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      dataBaixa: {
        type: Sequelize.STRING
      },
      tipo: {
        type: Sequelize.INTEGER
      },
      situacao: {
        type: Sequelize.INTEGER
      },
      id_categoria: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categoria',
          key: 'id'
        }
      },
      id_banco: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Banco',
          key: 'id'
        }
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'id'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('conta');
  }
};