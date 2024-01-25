/*
 * @Date: 2024-01-24 14:11:54
 * @LastEditors: tommyxia 709177815@qq.com
 * @LastEditTime: 2024-01-25 17:22:24
 * @FilePath: /test/src/build.ts
 */
import { getExcelFile } from './fetch'
import ExcelJS from 'exceljs'
import { groupBy } from 'lodash'
// 总共生成三个格式
// 1: {[countryCode]:{[provinceCode]:'provinceName'}[provinceCode]:{[cityCode]:'cityName'},cityCode:{[areaCode]:'areaName'}}
// 1: 

enum REGION_TYPE {
    COUNTRY = 'country',
    PROVINCE = 'province',
    CITY = 'city',
    AREA = 'area'
}

const getAllTypeList = (value: TOriginAreaData[]) => {
    const provinceList: TOriginAreaData[] = []
    const cityList: TOriginAreaData[] = []
    const areaList: TOriginAreaData[] = []
    value.forEach(element => {
        if (element.type === 'province') {
            provinceList.push(element)
        } else if (element.type === 'city') {
            cityList.push(element)
        } else if (element.type === 'area') {
            areaList.push(element)
        }
    });
    return {
        provinceList,
        cityList,
        areaList
    }
}


const getType = (value: string) => {
    const [country, province, city, area] = value.split(',');
    let type;
    if (area) {
        type = REGION_TYPE.AREA;
    } else if (city) {
        type = REGION_TYPE.CITY;
    } else if (province) {
        type = REGION_TYPE.PROVINCE;
    } else {
        type = REGION_TYPE.COUNTRY;
    }
    return {
        country,
        province,
        city,
        area,
        type
    }
}

type TOriginAreaData = {
    code: string,
    country: string;
    province: string;
    city: string;
    area: string;
    type: REGION_TYPE;
}

const buildTree = (list: TOriginAreaData[]) => {
    const province = groupBy(list, 'type');
    console.log(province);
}

const PPRun = async () => {
    const stream = await getExcelFile()

    const workbook = new ExcelJS.Workbook();
    if (stream) {
        await workbook.xlsx.read(stream)
        const list: TOriginAreaData[] = []
        const worksheet = workbook.getWorksheet('Sheet1');
        if (worksheet) {
            for (let j = 1; j <= worksheet.rowCount; j++) {
                const rowNum = j;
                let type = 'code'
                let obj = {} as TOriginAreaData
                for (let index = 1; index <= worksheet.columnCount; index++) {
                    const columnNum = index
                    if (type === 'code') {
                        obj.code = worksheet.getCell(rowNum, columnNum).value as string
                    } else {
                        obj = { ...obj, ...getType(worksheet.getCell(rowNum, columnNum).value as string) }
                    }
                    type = 'name'

                }
                list.push(obj)
                type = 'code'

            }
            buildTree(list)
        }


    }

}

PPRun()

// export default PPRun