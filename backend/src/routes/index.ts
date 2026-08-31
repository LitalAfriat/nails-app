import { Router } from "express";

const router = Router();

const apiController = require("../controllers/api");

router.route("/sendEmailCode").post(apiController.sendEmailCode);
router.route("/checkCode").post(apiController.checkCode);
router.route("/checkTokenEmail").post(apiController.checkTokenEmail);

module.exports = router;
