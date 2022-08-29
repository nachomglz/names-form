"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Name_1 = __importDefault(require("../models/Name"));
const NamesController = {
    createName: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, meaning, origin } = req.body;
        if (name === undefined || name === null || name.trim().length === 0) {
            return res.status(404).send({
                status: "failed",
                message: "No name was introduced in the form",
            });
        }
        try {
            // Check if the name exists
            const doc = yield Name_1.default.exists({ name: name });
            if (doc && doc._id) {
                // exits
                return res.send({
                    status: "failed",
                    message: "The name already exists"
                });
            }
            else {
                // doesn't exist
                const newName = new Name_1.default({
                    name: name,
                    meaning: meaning,
                    origin: origin
                });
                // Save name
                newName.save().then(doc => {
                    if (doc) {
                        return res.send({
                            status: "success",
                            message: "The name has been created successfully",
                            name: doc
                        });
                    }
                    else {
                        return res.send({
                            status: "failed",
                            message: "The name has not been created",
                        });
                    }
                });
            }
        }
        catch (e) {
            return res.status(400).send({
                status: "failed",
                message: "An error occured",
                errorMessage: e
            });
        }
    }),
    modifyName: (req, res) => {
        const { _id, name, meaning, origin } = req.body;
        if (_id === undefined || _id === null) {
            return res.status(404).send({
                status: "failed",
                message: "No id was introduced in the form",
            });
        }
        try {
            Name_1.default.findByIdAndUpdate(_id, { name: name, origin: origin, meaning: meaning }, { returnOriginal: false }).then(doc => {
                if (doc) {
                    return res.send({
                        status: "success",
                        message: "Name updated correctly",
                        name: doc
                    });
                }
                else {
                    return res.send({
                        status: "failed",
                        message: "No name was updated"
                    });
                }
            });
        }
        catch (e) {
            return res.send({
                status: "failed",
                message: "An error occured",
                errorMessage: e
            });
        }
    },
    getNames: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let limit = parseInt(req.query.limit);
        limit = (limit === undefined || limit === null) ? 0 : limit;
        let names = [];
        if (limit === undefined || limit === null) {
            // Get all the names
            names = yield Name_1.default.find().limit(limit);
        }
        else {
            // Get the limited items
            names = yield Name_1.default.find().limit(limit);
        }
        if (names) {
            return res.send({
                status: "success",
                message: "names retrieved successfully!!",
                names
            });
        }
        else {
            return res.send({
                status: "failed",
                message: "No players were found"
            });
        }
    }),
    deleteName: (req, res) => {
        const { _id } = req.body;
        if (_id) {
            // Delete name from db
            Name_1.default.deleteOne({ _id }).then(doc => {
                if (doc) {
                    return res.send({
                        status: "success",
                        message: "The name has been deleted correctly",
                        name: doc
                    });
                }
            }).catch(err => {
                console.log(err);
                return res.status(400).send({
                    status: "failed",
                    message: "There was an error trying to delete the name",
                    exceptionMessage: err
                });
            });
        }
        else {
            return res.status(404).send({
                status: "failed",
                message: "No name was sent",
            });
        }
    }
};
exports.default = NamesController;
