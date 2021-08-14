const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
  static init(connection) {
    super.init({
      nome: DataTypes.STRING,
      email: DataTypes.STRING,
      senha: DataTypes.STRING,
      foto: DataTypes.STRING,
    }, {
      sequelize: connection,
      modelName: 'usuario',
      tableName: 'usuario'
    })
  }

  static associate(models) {
    // define association here
  }
};

module.exports = Usuario