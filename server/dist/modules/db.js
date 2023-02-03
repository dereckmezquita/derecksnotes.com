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
exports.page = void 0;
const page = (collection, filter = {}, pageSize, nextID) => __awaiter(void 0, void 0, void 0, function* () {
    if (nextID)
        filter['_id'] = { $lt: nextID };
    const docs = yield collection
        .find(filter)
        .sort({ _id: -1 })
        .limit(pageSize + 1)
        .toArray();
    nextID = undefined;
    if (docs[(pageSize + 1) - 1]) {
        nextID = docs[(pageSize + 1) - 2]['_id'];
        docs.splice(-1, 1); // remove last one
    }
    for (const doc of docs) {
        delete doc['_id'];
    }
    return { docs: docs, nextID: nextID };
});
exports.page = page;
