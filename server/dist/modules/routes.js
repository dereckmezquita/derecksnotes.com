"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = exports.router = void 0;
const express_1 = require("express");
// ------------------------
const getDefinitions_1 = require("./routes/getDefinitions");
const getEntries_1 = require("./routes/getEntries");
const getLikes_1 = require("./routes/getLikes");
const postLogin_1 = require("./routes/postLogin");
const postRegister_1 = require("./routes/postRegister");
exports.router = (0, express_1.Router)();
exports.router.use(getEntries_1.getEntries, getLikes_1.getLikes, getDefinitions_1.getDefinitions, postRegister_1.postRegister, postLogin_1.postLogin);
const initDB = (client) => {
    (0, getEntries_1.initGetEntries)(client);
    (0, getDefinitions_1.initGetDefinitions)(client);
    (0, getLikes_1.initGetLikes)(client);
    (0, postRegister_1.initRegister)(client);
    (0, postLogin_1.initLogin)(client);
};
exports.initDB = initDB;
