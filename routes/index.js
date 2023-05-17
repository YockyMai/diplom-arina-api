const Router = require("express");
const router = new Router();

const appointmentRouter = require("./appointmentRouter");
const userRouter = require("./userRouter");
const serviceRouter = require("./serviceRouter");
const calendarRouter = require("./calendarRouter");

router.use("/appointment", appointmentRouter);
router.use("/user", userRouter);
router.use("/service", serviceRouter);
router.use("/calendar", calendarRouter);

module.exports = router;
