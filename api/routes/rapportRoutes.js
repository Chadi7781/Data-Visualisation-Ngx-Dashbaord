const express = require("express");
const router = express.Router();

const rapportController = require('../controller/rapportController')
router.get("/", rapportController.getRapports);

router.get("/calculateCA",rapportController.calculateCAPerZone);

module.exports = router;
