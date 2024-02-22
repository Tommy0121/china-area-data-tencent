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
exports.getExcelFile = exports.getExcelFileUrl = void 0;
/*
 * @Date: 2024-01-24 14:08:59
 * @LastEditors: tommyxia 709177815@qq.com
 * @LastEditTime: 2024-01-25 17:44:05
 * @FilePath: /test/src/fetch.ts
 */
const puppeteer_1 = __importDefault(require("puppeteer"));
const jszip_1 = __importDefault(require("jszip"));
const TENCENT_REGION_DATA_URL = 'https://lbs.qq.com/service/webService/webServiceGuide/webServiceDistrict';
// 这个没有很准，提供selector入参
const xPath = '//*[@id="__layout"]/div/div[1]/div[2]/div[2]/div[1]/div[2]/p[16]/a';
const getExcelFileUrl = (url = TENCENT_REGION_DATA_URL, selector = xPath) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    yield page.goto(url !== null && url !== void 0 ? url : TENCENT_REGION_DATA_URL);
    const linkElement = yield page.$x(selector);
    const link = yield linkElement[0].getProperty('href');
    const value = yield link.jsonValue();
    yield browser.close();
    return value;
});
exports.getExcelFileUrl = getExcelFileUrl;
const getExcelFile = () => __awaiter(void 0, void 0, void 0, function* () {
    // const link = await getExcelFileUrl()
    // TODO 暂时写死成这样的
    const link = 'https://mapapi.qq.com/web/district-code/district-code_20230901.zip';
    return fetch(link).then(res => res.arrayBuffer()).then((arraybuffer) => jszip_1.default.loadAsync(arraybuffer).then((zip) => {
        const { files } = zip;
        const fileNameList = Object.keys(files);
        const finalFileName = fileNameList.filter((filename) => filename.endsWith('.xlsx') && !filename.startsWith('__MACOSX'))[0];
        console.log('filename', finalFileName);
        return zip.file(finalFileName);
    }).then((file) => {
        if (file) {
            return file.nodeStream();
        }
        return null;
    }));
});
exports.getExcelFile = getExcelFile;
