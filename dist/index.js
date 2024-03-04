#!/usr/bin/env node
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
const commander_1 = require("commander");
const buildData_1 = require("./buildData");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
commander_1.program.name('china-area-data-tencent')
    .version(`${process.env.npm_package_version}`);
commander_1.program
    .option('-u --url <url>')
    .option('-o --output <output>')
    .option('-s --selector <selector>');
commander_1.program.parse(process.argv);
const options = commander_1.program.opts();
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, buildData_1.PPRun)(options.url, options.selector);
    if (result) {
        const { tree, data } = result;
        const p = options.output || process.cwd();
        const DATA_DIR = path_1.default.resolve(p, './dist');
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
        const treeFile = `${DATA_DIR}/tree.json`;
        const dataFile = `${DATA_DIR}/data.json`;
        fs_1.default.writeFileSync(treeFile, JSON.stringify(tree, null, 2));
        fs_1.default.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    }
});
run();
