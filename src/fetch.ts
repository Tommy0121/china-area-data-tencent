/*
 * @Date: 2024-01-24 14:08:59
 * @LastEditors: tommyxia 709177815@qq.com
 * @LastEditTime: 2024-01-25 17:44:05
 * @FilePath: /test/src/fetch.ts
 */
import puppeteer from 'puppeteer';
import JSZip from "jszip";

const TENCENT_REGION_DATA_URL = 'https://lbs.qq.com/service/webService/webServiceGuide/webServiceDistrict'

// 这个没有很准，提供selector入参
const xPath = '//*[@id="__layout"]/div/div[1]/div[2]/div[2]/div[1]/div[2]/p[16]/a'

// const injectSelector = () => {
//     const link = Array.from(document.querySelectorAll('a'))?.filter(item => item.innerText === "行政区划编码表" && item.href !== '')[0]?.href
//     return link
// }


export const getExcelFileUrl = async (url: string = TENCENT_REGION_DATA_URL, selector: string = xPath): Promise<string> => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage();
    await page.goto(url ?? TENCENT_REGION_DATA_URL);
    const linkElement = await page.$x(selector)
    const link = await linkElement[0].getProperty('href')
    const value = await link.jsonValue() as string
    await browser.close()
    return value


}

export const getExcelFile = async (): Promise<null | NodeJS.ReadableStream> => {
    // const link = await getExcelFileUrl()
    // TODO 暂时写死成这样的
    const link = 'https://mapapi.qq.com/web/district-code/district-code_20230901.zip'
    return fetch(link).then(res => res.arrayBuffer()).then((arraybuffer) => JSZip.loadAsync(arraybuffer).then((zip) => {
        const { files } = zip
        const fileNameList = Object.keys(files)
        const finalFileName = fileNameList.filter((filename) => filename.endsWith('.xlsx') && !filename.startsWith('__MACOSX'))[0]
        console.log('filename', finalFileName)
        return zip.file(finalFileName)

    }).then((file) => {
        if (file) {
            return file.nodeStream()
        }
        return null
    })
    )
}