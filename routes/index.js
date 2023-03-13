const Router = require("express");
const router = new Router();

const appointmentRouter = require("./appointmentRouter");
const userRouter = require("./userRouter");
const serviceRouter = require("./serviceRouter");

router.use("/appointment", appointmentRouter);
router.use("/user", userRouter);
router.use("/service", serviceRouter);

module.exports = router;
