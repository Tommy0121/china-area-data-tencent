/*
 * @Date: 2024-01-24 14:11:54
 * @LastEditors: tommyxia 709177815@qq.com
 * @LastEditTime: 2024-01-25 17:22:24
 * @FilePath: /test/src/build.ts
 */
import { getExcelFile, TENCENT_REGION_DATA_URL, xPath } from './fetch'
import ExcelJS from 'exceljs'
import { Dictionary, groupBy } from 'lodash'

enum REGION_TYPE {
  COUNTRY = 'country',
  PROVINCE = 'province',
  CITY = 'city',
  AREA = 'area'
}

const ChinaCountryCode = '86'



type TreeNode = {
  label: string;
  value: string;
  children?: TreeNode[];
}

const getType = (value: string) => {
  let [country, province, city, area] = value.split(',');
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
  // 直辖市无省有市手动处理
  if (!province && city) {
    province = city
  }
  // 香港澳门只有两级，将其作为一级单位放到最后
  if (province && (province.includes('澳门') || province.includes('香港'))) {
    // 特殊处理垃圾数据，如果有province，但是没有city 则将类型置为city
    if (!city) {
      type = REGION_TYPE.CITY
      city = province
    }
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

const buildTreeNode = (current: TreeNode, childrenData: TOriginAreaData[], allData: Dictionary<TOriginAreaData[]>) => {
  current.children = childrenData.map(element => {
    let children
    if (childrenData) {
      children = allData[REGION_TYPE.AREA].filter(item => item.city === element.city).map(item => ({ label: item.area, value: item.code }))
    }
    return { label: element.city, value: element.code, children }
  })
  return current
}

const buildTree = (list: TOriginAreaData[]): TreeNode[] => {
  const allData = groupBy(list, 'type');
  let result: TreeNode[] = []
  allData[REGION_TYPE.PROVINCE].forEach(element => {
    result.push(buildTreeNode({ value: element.code, label: element.province }, allData[REGION_TYPE.CITY].filter(item => item.province === element.province), allData))
  })
  // 特殊处理香港澳门
  const specialList = allData[REGION_TYPE.CITY].filter(item => item.city.includes('香港') || item.city.includes('澳门'))
  specialList.forEach(element => {
    result.push({ value: element.code, label: element.city, children: allData[REGION_TYPE.AREA].filter(item => item.city === element.city).map(item => ({ label: item.area, value: item.code })) })
  })

  return result
}

type TData = {
  [key: string]: {
    [key: string]: string;
  };
}

const isEmptyObj = (obj: TData) => {
  const keys = Object.keys(obj)
  return keys.length === 1 && Object.keys(obj[keys[0]]).length === 0
}

const buildData = (tree: TreeNode[]): TData => {
  let result: { [key: string]: { [key: string]: string } } = {}
  tree.forEach(element => {
    if (element?.children) {
      let obj: { [key: string]: { [key: string]: string } } = { [element.value]: {} }
      let temp: TData = {}
      element.children.forEach(item => {
        obj[element.value][item.value] = item.label
        if (item.children) {
          temp = { ...temp, ...buildData([item]) }
        }
      })
      if (isEmptyObj(obj)) {
        obj = {}
      }
      result = { ...result, ...obj, ...temp }
    }
  })
  return result
}

const buildJsonData = (tree: TreeNode[]) => {
  const countryArray: { [key: string]: { [key: string]: string } } = { [ChinaCountryCode]: {} }
  tree.forEach(element => {
    if (element?.children) {
      countryArray[ChinaCountryCode][element.value] = element.label
    }
  })
  const res = { ...countryArray }
  const data = buildData(tree)
  return { ...res, ...data }
}

export const PPRun = async (url: string = TENCENT_REGION_DATA_URL, selector: string = xPath) => {
  const stream = await getExcelFile(url, selector)

  const workbook = new ExcelJS.Workbook();

  let tree = []
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
      tree = buildTree(list)
      const data = buildJsonData(tree)

      return { tree, data }
    }


  }
  return null

}