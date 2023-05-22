const { Times, Calendar, Days } = require("../models/models");
const apiError = require("../error/apiError");
const cron = require("node-cron");

const timesData = [
  { time: "9:00" },
  { time: "10:00" },
  { time: "11:00" },
  { time: "12:00" },
  { time: "13:00" },
  { time: "14:00" },
  { time: "15:00" },
  { time: "16:00" },
  { time: "17:00" },
  { time: "18:00" },
  { time: "19:00" },
  { time: "20:00" },
  { time: "21:00" },
];

class calendarController {
  async createCalendar(req, res, next) {
    try {
      const { serviceId } = req.body;
      console.log(serviceId);
      const calendar = await Calendar.create({ serviceId });

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

      return res.json({ message: "success" });
    } catch (e) {
      console.log(e);
      next(apiError.badRequest(e.message));
    }
  }

  async fillCalendarEveryday(req, res) {
    res.send("Автоматическое обновление расписания началось");
    cron.schedule("*/15 * * * *", async () => {
      try {
        const calendars = await Calendar.findAll();

        calendars.forEach(async (calendar) => {
          const day = await Days.findOne({
            order: [["day", "DESC"]],
            where: {
              calendarId: calendar.id,
            },
          });

          const date = day.day;
          date.setDate(date.getDate() + 1);

          const nextDay = await Days.create({
            day: date,
            calendarId: calendar.id,
          });

          timesData.forEach(async ({ time }) => {
            await Times.create({ time, dayId: nextDay.id });
          });
        });

        console.log("Расписание обновленно");
      } catch (err) {
        console.error("Error deleting records:", err);
      }
    });
  }

  async deletePastDates(req, res) {
    res.send("Автоматическое удаление расписания началось");
    cron.schedule("*/15 * * * *", async () => {
      try {
        const days = await Days.findAll();

        days.forEach(async (dayObj) => {
          if (
            new Date(dayObj.day) <= new Date() &&
            new Date(dayObj.day).getDate() < new Date().getDate()
          ) {
            await Times.destroy({ where: { dayId: dayObj.id } });
            await Days.destroy({ where: { id: dayObj.id } });
            console.log("Удалены записи из расписания");
          }
        });
      } catch (err) {
        console.error("Error deleting records:", err);
      }
    });
  }
}

module.exports = new calendarController();
