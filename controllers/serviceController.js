const {
  Service,
  User,
  Appointment,
  Calendar,
  Days,
  Times,
} = require("../models/models");
const { v4: uuidv4 } = require("uuid");
const apiError = require("../error/apiError");
const path = require("path");

class serviceController {
  async create(req, res, next) {
    try {
      const { name, price, description, master_id } = req.body;
      const { img } = req.files;

      let fileName = uuidv4() + ".jpg"; // generate uniq filename
      img.mv(path.resolve(__dirname, "..", "static", fileName)); // move file in a static folder, * __dirname - current loication, next params - path to static folder *

      const service = await Service.create({
        name,
        price,
        description,
        img: fileName,
        userId: master_id,
      });

      const calendar = await Calendar.create({ serviceId: service.id });

      // Определение текущей даты
      const currentDate = new Date();

      // Определение последнего дня месяца
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      // Создание массива объектов для заполнения таблицы "days"
      const daysToCreate = [];
      let currentDateToAdd = currentDate;

      while (currentDateToAdd <= lastDayOfMonth) {
        daysToCreate.push({
          day: new Date(currentDateToAdd),
          calendarId: calendar.id,
        });
        currentDateToAdd.setDate(currentDateToAdd.getDate() + 1);
      }

      console.log(daysToCreate);

      const days = await Days.bulkCreate(daysToCreate);

      days.forEach((day) => {
        timesData.forEach(async ({ time }) => {
          await Times.create({ time, dayId: day.id });
        });
      });

      return res.json(service);
    } catch (error) {
      next(apiError.badRequest(error.message));
    }
  }

  async edit(req, res, next) {
    try {
      const { serviceId, masterId, description, price, name } = req.body;

      const services = await Service.update(
        { name, userId: masterId, description, price },
        { where: { id: serviceId } }
      );
      return res.json(services);
    } catch (error) {
      next(apiError.badRequest(error.message));
      console.log(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { serviceId } = req.params;

      await Appointment.destroy({ where: { serviceId } });
      await Service.destroy({
        where: { id: serviceId },
      });
      return res.json({ message: "Успешно" });
    } catch (error) {
      next(apiError.badRequest(error.message));
      console.log(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const services = await Service.findAll({
        include: [
          { model: User },
          {
            model: Calendar,
            include: [{ model: Days, include: { model: Times } }],
          },
        ],
      });
      return res.json(services);
    } catch (error) {
      next(apiError.badRequest(error.message));
      console.log(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;

      const services = await Service.findOne({
        where: {
          id,
        },
        include: [
          { model: User },
          {
            model: Calendar,
            include: [{ model: Days, include: { model: Times } }],
          },
        ],
      });
      return res.json(services);
    } catch (error) {
      next(apiError.badRequest(error.message));
      console.log(error);
    }
  }
}

module.exports = new serviceController();
