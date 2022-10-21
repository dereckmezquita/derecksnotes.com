"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGetLikes = exports.getLikes = void 0;
const express_1 = require("express");
const helpers_1 = require("../helpers");
exports.getLikes = (0, express_1.Router)();
const initGetLikes = (client) => {
    // post request for getting entries for index page
    // allows to request entries for page blog, courses, etc and number of posts
    // will listen for request for more entries
    exports.getLikes.get('/getLikes', (req, res) => {
        (0, helpers_1.sendRes)(res, true, { someKey: "Some value!" });
    });
};
exports.initGetLikes = initGetLikes;
