"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const streams_1 = __importDefault(require("./routes/streams"));
const streamsMock_1 = __importDefault(require("./routes/streamsMock"));
const health_1 = __importDefault(require("./routes/health"));
const twitch_1 = __importDefault(require("./routes/twitch"));
const redm_1 = __importDefault(require("./routes/redm"));
const live_1 = __importDefault(require("./routes/live"));
const discord_1 = __importDefault(require("./routes/discord"));
const twitchController_1 = require("./controllers/twitchController");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
// Twitch EventSub webhook must be mounted with raw body BEFORE json parser
app.post('/api/twitch/eventsub/webhook', express_1.default.raw({ type: 'application/json' }), twitchController_1.eventsubWebhook);
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
app.use('/api/streams', streams_1.default);
app.use('/api/streams/mock', streamsMock_1.default);
app.use('/api/health', health_1.default);
app.use('/api/twitch', twitch_1.default);
app.use('/api/redm', redm_1.default);
app.use('/api/live', live_1.default);
app.use('/api/discord', discord_1.default);
app.get('/', (req, res) => {
    res.send('StreamPulse API is running');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
