"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NamesController_1 = __importDefault(require("../controllers/NamesController"));
const router = (0, express_1.Router)();
// Create routes
router.post("/create_name", NamesController_1.default.createName);
router.put("/modify_name", NamesController_1.default.modifyName);
router.get("/names", NamesController_1.default.getNames);
router.delete("(/delete)", NamesController_1.default.deleteName);
exports.default = router;
