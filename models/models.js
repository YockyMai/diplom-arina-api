const sequelize = require("../db");
const { DataTypes } = require("Sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  phone: {
    type: DataTypes.NUMBER,
    defaultValue: "+7 (999) 999 99-99",
  },
});

const Service = sequelize.define("service", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  img: { type: DataTypes.STRING, allowNull: false },
});

const Appointment = sequelize.define(
  "appointment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATE, require: true },
    canceled: { type: DataTypes.INTEGER, require: true, defaultValue: 0 },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Appointment);
Appointment.belongsTo(User);

Service.hasMany(Appointment);
Appointment.belongsTo(Service);

User.hasMany(Service);
Service.belongsTo(User);

module.exports = {
  User,
  Service,
  Appointment,
};
