const Router = require("express");
const serviceController = require("../controllers/serviceController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const router = new Router();

router.post("/create", checkRoleMiddleware("ADMIN"), serviceController.create);
router.get("/getAll", serviceController.getAll);
router.post("/edit", checkRoleMiddleware("ADMIN"), serviceController.edit);
router.delete(
  "/delete/:serviceId",
  checkRoleMiddleware("ADMIN"),
  serviceController.delete
);
router.get("/:id", serviceController.getOne);

module.exports = router;
