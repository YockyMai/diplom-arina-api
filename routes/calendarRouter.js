const Router = require("express");
const router = new Router();

const calendarController = require("../controllers/calendarController");

router.post("/createCalendar", calendarController.createCalendar);
router.post("/fillCalendarEveryday", calendarController.fillCalendarEveryday);
router.post("/deletePastDates", calendarController.deletePastDates);

module.exports = router;
