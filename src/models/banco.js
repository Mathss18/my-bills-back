const { Model, DataTypes } = require('sequelize');

class Banco extends Model {
  static init(connection) {
    super.init({
      nome: DataTypes.STRING,
      saldo: DataTypes.DOUBLE(9,2),
      logo: DataTypes.STRING,
      id_usuario: DataTypes.INTEGER,
    }, {
      sequelize: connection,
      modelName: 'banco',
      tableName: 'banco'
    })
  }

  static associate(models) {
    // define association here
  }
};

module.exports = Banco