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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGetDefinitions = exports.getDefinitions = void 0;
const express_1 = require("express");
const helpers_1 = require("../helpers");
const mongodb_1 = require("mongodb");
const db_1 = require("../db");
exports.getDefinitions = (0, express_1.Router)();
const _ = undefined;
const initGetDefinitions = (client) => {
    // a post request for getting data for dictionaries page
    // responds to requests for different dictionaries; results are filtered
    // will listen to request for more definitions
    exports.getDefinitions.post('/getDefinitions', (req, res) => {
        const { dictionary, letter, pageSize, nextToken } = req.body;
        const dictionaries = ['biology', 'chemistry'];
        if (typeof dictionary !== 'string')
            return (0, helpers_1.sendRes)(res, false, _, "Invalid type for dictionary");
        if (!dictionaries.includes(dictionary))
            return (0, helpers_1.sendRes)(res, false, _, "Invalid value for dictionary");
        if (typeof letter !== 'string')
            return (0, helpers_1.sendRes)(res, false, _, "Invalid type for letter");
        if (typeof pageSize !== 'number')
            return (0, helpers_1.sendRes)(res, false, _, "Invalid type for pageSize");
        if (pageSize > 30 || pageSize < 1)
            return (0, helpers_1.sendRes)(res, false, _, "Invalid size for pageSize");
        if (typeof nextToken !== 'string' && typeof nextToken !== 'undefined')
            return (0, helpers_1.sendRes)(res, false, _, "Invalid type for nextToken");
        if (nextToken) {
            if (!mongodb_1.ObjectId.isValid(nextToken)) {
                return (0, helpers_1.sendRes)(res, false, _, "Invalid value for nextToken");
            }
        }
        // query the mongo database for definitions and send them back to the client
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const db = client.db('dictionaries');
            const collection = db.collection('definitions');
            // get the data which matches the request dictionary and letter
            // if letter is # then return all other symbols/numbers
            const { docs, nextID } = yield (0, db_1.page)(collection, {
                dictionary: dictionary,
                letter: letter === '#' ? { $not: { $regex: /^[a-z]$/ } } : letter
            }, pageSize, new mongodb_1.ObjectId(nextToken));
            (0, helpers_1.sendRes)(res, true, { definitions: docs, nextToken: nextID });
        }))();
    });
};
exports.initGetDefinitions = initGetDefinitions;
