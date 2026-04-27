"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const streamController_1 = require("../controllers/streamController");
const router = (0, express_1.Router)();
router.post('/start', auth_1.authenticateToken, streamController_1.mockStart);
router.post('/stop', auth_1.authenticateToken, streamController_1.mockStop);
exports.default = router;
