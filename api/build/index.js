"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const NamesRouter_1 = __importDefault(require("./routers/NamesRouter"));
// Conditionally import dotenv
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const PORT = process.env.PORT || 8080;
// Create app
const app = (0, express_1.default)();
// Add middleware
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(NamesRouter_1.default);
// Start server
mongoose_1.default.connect("mongodb://localhost:27017/names").then(res => {
    if (res) {
        app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
    }
}).catch(err => {
    console.error(err);
});
