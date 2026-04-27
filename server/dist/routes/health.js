"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const healthController_1 = require("../controllers/healthController");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticateToken, healthController_1.logHealth);
router.get('/', auth_1.authenticateToken, healthController_1.getHealthLogs);
exports.default = router;
