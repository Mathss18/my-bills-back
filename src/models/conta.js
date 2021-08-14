const { Model, DataTypes } = require('sequelize');

class Conta extends Model {
  static init(connection) {
    super.init({
      title: DataTypes.STRING,
      start: DataTypes.STRING,
      end: DataTypes.STRING,
      color: DataTypes.STRING,
      description: DataTypes.STRING,
      dataBaixa: DataTypes.STRING,
      tipo: DataTypes.INTEGER,
      situacao: DataTypes.INTEGER,
      id_categoria: DataTypes.INTEGER,
      id_banco: DataTypes.INTEGER,
      id_usuario: DataTypes.INTEGER,
    }, {
      sequelize: connection,
      modelName: 'conta',
      tableName: 'conta'
    })
  }

  static associate(models) {
    // define association here
  }
};

module.exports = Conta