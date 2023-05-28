const apiError = require("../error/apiError");
const {
  Appointment,
  Service,
  User,
  Times,
  Days,
  Calendar,
} = require("../models/models");
const dayjs = require("dayjs");

class appointmentController {
  async create(req, res, next) {
    try {
      const { serviceId, userId, dayId, timeId } = req.body;

      const dayCandidate = await Days.findOne({ where: { id: dayId } });
      const timeCandidate = await Times.findOne({ where: { id: timeId } });

      if (!dayCandidate || !timeCandidate)
        return res.status(400).json({ message: "Это время занято" });

      const date = dayCandidate.day;

      const time = Number(timeCandidate.time.replace(":00", ""));
      date.setHours(time);

      const appointment = await Appointment.create({
        userId,
        serviceId,
        date,
      });

      await Times.destroy({ where: { id: timeId, dayId } });

      return res.json(appointment);
    } catch (error) {
      console.log(error);
      next(apiError(400, "Не удалось вас записать"));
    }
  }

  async cancel(req, res, next) {
    try {
      const { appointmentId } = req.body;

      const appointment = await Appointment.findByPk(appointmentId);

      const calendar = await Calendar.findOne({
        where: { serviceId: appointment.serviceId },
      });
      const day = await Days.findOne({
        where: { calendarId: calendar.id },
      });

      const time = dayjs(appointment.date).format("H:00");
      await Times.create({ dayId: day.id, time: time });

      appointment.canceled = true;
      appointment.save();

      return res.json(appointment);
    } catch (error) {
      console.log(error);
      next(apiError(400, "Не отменить услугу"));
    }
  }

  async getAllForUser(req, res, next) {
    try {
      const { id } = req.user;

      const appointment = await Appointment.findAll({
        where: { userId: id, canceled: false },
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
        where: { serviceId: service.id, canceled: false },
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
