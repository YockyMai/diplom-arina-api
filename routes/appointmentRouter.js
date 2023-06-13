const Router = require("express");
const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();
const cron = require("node-cron");
const { Appointment } = require("../models/models");
const Sequelize = require("sequelize");

router.post("/create", authMiddleware, appointmentController.create);
router.post("/cancel", authMiddleware, appointmentController.cancel);
router.get(
  "/getAllForUser",
  authMiddleware,
  appointmentController.getAllForUser
);
router.get(
  "/getAllForMaster",
  authMiddleware,
  appointmentController.getAllForMaster
);
router.get("/start-task", (req, res) => {
  cron.schedule("*/30 * * * * *", async () => {
    try {
      await Appointment.update(
        { canceled: 1 },
        {
          where: {
            date: {
              [Sequelize.Op.lt]: new Date(),
            },
          },
        }
      );
    } catch (err) {
      console.error("Error deleting records:", err);
    }
    res.send("Task started successfully!");
  });
});

module.exports = router;
