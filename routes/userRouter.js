const Router = require("express");
const router = new Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.get("/findUsers", userController.findUsers);
router.get("/findMasters", userController.findMasters);
router.get("/findAll", userController.findAllUsers);
router.post("/changeRole", userController.changeRole);
router.post("/editUser", userController.editUser);

module.exports = router;
