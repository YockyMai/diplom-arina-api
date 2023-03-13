const Router = require("express");
const serviceController = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const router = new Router();

router.post("/create", serviceController.create);
router.get("/getAll", serviceController.getAll);
router.get("/:id", serviceController.getOne);

module.exports = router;
