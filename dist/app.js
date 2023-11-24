"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_router_1 = require("./user/user.router");
const cors_1 = __importDefault(require("cors"));
const dotenv = require("dotenv");
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// application routes
app.use('/api/users', user_router_1.UserRoutes);
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
