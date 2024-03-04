"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buildData_1 = require("./buildData");
const generator_1 = require("./generator");
const fs_1 = __importDefault(require("fs"));
(0, buildData_1.PPRun)().then((res) => {
    if (res) {
        const { tree, data } = res;
        const path = generator_1.DATA_DIR;
        if (!fs_1.default.existsSync(path)) {
            fs_1.default.mkdirSync(path, { recursive: true });
        }
        const treeFile = `${generator_1.DATA_DIR}/tree.json`;
        const dataFile = `${generator_1.DATA_DIR}/data.json`;
        fs_1.default.writeFileSync(treeFile, JSON.stringify(tree, null, 2));
        fs_1.default.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    }
});
