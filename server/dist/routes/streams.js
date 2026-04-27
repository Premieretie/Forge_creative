"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const streamController_1 = require("../controllers/streamController");
const router = (0, express_1.Router)();
router.post('/sync', auth_1.authenticateToken, streamController_1.syncTwitchData);
router.get('/', auth_1.authenticateToken, streamController_1.getStreams);
exports.default = router;
