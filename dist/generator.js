"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_DIR = void 0;
const buildData_1 = require("./buildData");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.DATA_DIR = path_1.default.resolve(__dirname, '../dist/data');
exports.default = (dirPath) => {
    (0, buildData_1.PPRun)().then((res) => {
        if (res) {
            const { tree, data } = res;
            const path = dirPath || exports.DATA_DIR;
            if (!fs_1.default.existsSync(path)) {
                fs_1.default.mkdirSync(path, { recursive: true });
            }
            const treeFile = `${exports.DATA_DIR}/tree.json`;
            const dataFile = `${exports.DATA_DIR}/data.json`;
            fs_1.default.writeFileSync(treeFile, JSON.stringify(tree, null, 2));
            fs_1.default.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        }
    });
};
