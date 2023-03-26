const apiError = require("../error/apiError");
const { Appointment, Service, User } = require("../models/models");

class appointmentController {
  async create(req, res, next) {
    try {
      const { serviceId, date, userId } = req.body;

      const candidate = await Appointment.findOne({ where: { date, userId } });

      if (candidate)
        return res.status(400).json({ message: "Это время занято" });

      const appointment = await Appointment.create({ userId, serviceId, date });

      return res.json(appointment);
    } catch (error) {
      next(apiError(400, "Не удалось вас записать"));
    }
  }

  async getAllForUser(req, res, next) {
    try {
      const { id } = req.user;

      const appointment = await Appointment.findAll({
        where: { userId: id },
        include: [User, { model: Service, include: User }],
      });

      return res.json(appointment);
    } catch (error) {
      next(apiError(400, "Ошибка сервера"));
    }
  }
  async getAllForMaster(req, res, next) {
    try {
      const { id } = req.user;

      const service = await Service.findOne({ where: { userId: id } });

      const appointment = await Appointment.findAll({
        where: { serviceId: service.id },
        include: [User, { model: Service, include: User }],
      });

      return res.json(appointment);
    } catch (error) {
      console.log(error);
      next(apiError(400, "Ошибка сервера"));
    }
  }
}

module.exports = new appointmentController();
