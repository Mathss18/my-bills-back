const { Model, DataTypes } = require('sequelize');

class Categoria extends Model {
  static init(connection) {
    super.init({
      descricao: DataTypes.STRING,
      cor: DataTypes.STRING,
      id_usuario: DataTypes.INTEGER,
    }, {
      sequelize: connection,
      modelName: 'categoria',
      tableName: 'categoria'
    })
  }

  static associate(models) {
    // define association here
  }
};

module.exports = Categoria