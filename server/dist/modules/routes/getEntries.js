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
exports.initGetEntries = exports.getEntries = void 0;
const express_1 = require("express");
const helpers_1 = require("../helpers");
const mongodb_1 = require("mongodb");
const db_1 = require("../db");
exports.getEntries = (0, express_1.Router)();
const _ = undefined;
const initGetEntries = (client) => {
    // post request for getting entries for index page
    // allows to request entries for page blog, courses, etc and number of posts
    // will listen for request for more entries
    exports.getEntries.post('/getEntries', (req, res) => {
        const { section, pageSize, nextToken } = req.body;
        const sections = ['blog', 'courses', 'exercises'];
        if (typeof section !== 'string')
            return (0, helpers_1.sendRes)(res, false, _, "Invalid type for section");
        // if (!sections.includes(section)) return sendRes(res, false, _, "Invalid value for section");
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
        // query mongo database for entries and send back to client
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const db = client.db('entries');
            const collection = db.collection("metadata");
            // get entries from db; if section is dictionaries dont filter by section and return 10 most recent entries
            // const { docs, nextID } = await page(collection, section === 'dictionaries' ? {} : { section: section }, pageSize, new ObjectId(nextToken));
            // const { docs, nextID } = await page(collection, {
            //     siteSection: section === "any" ? { $exists: true } : section
            // }, pageSize, new ObjectId(nextToken));
            // const { docs, nextID } = await page(collection, { siteSection: section }, pageSize, new ObjectId(nextToken));
            // return all entries which match siteSection and published is true
            const { docs, nextID } = yield (0, db_1.page)(collection, {
                siteSection: section,
                published: true
            }, pageSize, new mongodb_1.ObjectId(nextToken));
            (0, helpers_1.sendRes)(res, true, { entries: docs, nextToken: nextID });
        }))();
    });
};
exports.initGetEntries = initGetEntries;
