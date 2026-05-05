import { Router } from "express";

const router = Router();

const apiController = require("../controllers/api");

router.route("/sendEmailCode").post(apiController.sendEmailCode);
router.route("/sendCode").post(apiController.sendCode);

module.exports = router;
