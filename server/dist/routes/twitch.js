"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const twitchController_1 = require("../controllers/twitchController");
const router = express_1.default.Router();
router.get('/oauth/url', auth_1.authenticateToken, twitchController_1.getOauthUrl);
router.get('/oauth/callback', twitchController_1.oauthCallback);
router.post('/link-player', auth_1.authenticateToken, twitchController_1.linkPlayerIdentifier);
router.use('/', (0, twitchController_1.routerWithRaw)());
exports.default = router;
