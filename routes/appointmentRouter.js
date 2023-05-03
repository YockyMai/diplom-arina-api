const Router = require("express");
const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const router = new Router();

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

module.exports = router;
