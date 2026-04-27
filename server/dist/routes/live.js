"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const liveController_1 = require("../controllers/liveController");
const router = express_1.default.Router();
router.post('/start', auth_1.authenticateToken, liveController_1.startGoLive);
exports.default = router;
