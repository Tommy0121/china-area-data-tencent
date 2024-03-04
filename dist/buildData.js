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
exports.PPRun = void 0;
/*
 * @Date: 2024-01-24 14:11:54
 * @LastEditors: tommyxia 709177815@qq.com
 * @LastEditTime: 2024-01-25 17:22:24
 * @FilePath: /test/src/build.ts
 */
const fetch_1 = require("./fetch");
const exceljs_1 = __importDefault(require("exceljs"));
const lodash_1 = require("lodash");
var REGION_TYPE;
(function (REGION_TYPE) {
    REGION_TYPE["COUNTRY"] = "country";
    REGION_TYPE["PROVINCE"] = "province";
    REGION_TYPE["CITY"] = "city";
    REGION_TYPE["AREA"] = "area";
})(REGION_TYPE || (REGION_TYPE = {}));
const ChinaCountryCode = '86';
const getType = (value) => {
    let [country, province, city, area] = value.split(',');
    let type;
    if (area) {
        type = REGION_TYPE.AREA;
    }
    else if (city) {
        type = REGION_TYPE.CITY;
    }
    else if (province) {
        type = REGION_TYPE.PROVINCE;
    }
    else {
        type = REGION_TYPE.COUNTRY;
    }
    // 直辖市无省有市手动处理
    if (!province && city) {
        province = city;
    }
    // 香港澳门只有两级，将其作为一级单位放到最后
    if (province && (province.includes('澳门') || province.includes('香港'))) {
        // 特殊处理垃圾数据，如果有province，但是没有city 则将类型置为city
        if (!city) {
            type = REGION_TYPE.CITY;
            city = province;
        }
    }
    return {
        country,
        province,
        city,
        area,
        type
    };
};
const buildTreeNode = (current, childrenData, allData) => {
    current.children = childrenData.map(element => {
        let children;
        if (childrenData) {
            children = allData[REGION_TYPE.AREA].filter(item => item.city === element.city).map(item => ({ label: item.area, value: item.code }));
        }
        return { label: element.city, value: element.code, children };
    });
    return current;
};
const buildTree = (list) => {
    const allData = (0, lodash_1.groupBy)(list, 'type');
    let result = [];
    allData[REGION_TYPE.PROVINCE].forEach(element => {
        result.push(buildTreeNode({ value: element.code, label: element.province }, allData[REGION_TYPE.CITY].filter(item => item.province === element.province), allData));
    });
    // 特殊处理香港澳门
    const specialList = allData[REGION_TYPE.CITY].filter(item => item.city.includes('香港') || item.city.includes('澳门'));
    specialList.forEach(element => {
        result.push({ value: element.code, label: element.city, children: allData[REGION_TYPE.AREA].filter(item => item.city === element.city).map(item => ({ label: item.area, value: item.code })) });
    });
    return result;
};
const buildData = (tree) => {
    let result = [];
    tree.forEach(element => {
        if (element === null || element === void 0 ? void 0 : element.children) {
            let obj = { [element.value]: {} };
            let temp = [];
            element.children.forEach(item => {
                obj[element.value][item.value] = item.label;
                if (item.children) {
                    temp = temp.concat(buildData([item]));
                }
            });
            result.push(obj);
            result = result.concat(temp);
        }
    });
    return result;
};
const buildJsonData = (tree) => {
    const countryArray = { [ChinaCountryCode]: {} };
    tree.forEach(element => {
        if (element === null || element === void 0 ? void 0 : element.children) {
            countryArray[ChinaCountryCode][element.value] = element.label;
        }
    });
    const res = [countryArray];
    const data = buildData(tree);
    return res.concat(data);
};
const PPRun = (url = fetch_1.TENCENT_REGION_DATA_URL, selector = fetch_1.xPath) => __awaiter(void 0, void 0, void 0, function* () {
    const stream = yield (0, fetch_1.getExcelFile)();
    const workbook = new exceljs_1.default.Workbook();
    let tree = [];
    if (stream) {
        yield workbook.xlsx.read(stream);
        const list = [];
        const worksheet = workbook.getWorksheet('Sheet1');
        if (worksheet) {
            for (let j = 1; j <= worksheet.rowCount; j++) {
                const rowNum = j;
                let type = 'code';
                let obj = {};
                for (let index = 1; index <= worksheet.columnCount; index++) {
                    const columnNum = index;
                    if (type === 'code') {
                        obj.code = worksheet.getCell(rowNum, columnNum).value;
                    }
                    else {
                        obj = Object.assign(Object.assign({}, obj), getType(worksheet.getCell(rowNum, columnNum).value));
                    }
                    type = 'name';
                }
                list.push(obj);
                type = 'code';
            }
            tree = buildTree(list);
            const data = buildJsonData(tree);
            return { tree, data };
        }
    }
    return null;
});
exports.PPRun = PPRun;
