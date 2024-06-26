# 中国行政区域数据 腾讯版

腾讯地图版本的中国行政区规划数据格式化，数据来源为腾讯地图官方网站，见以下[链接](https://lbs.qq.com/service/webService/webServiceGuide/webServiceDistrict)  

数据文件在dist/data 中

**总共生成两个格式**  


- ` [countryCode:{provinceCode:'provinceName'},provinceCode:{cityCode:'cityName'},cityCode:{areaCode:'areaName'}]`  主要是为了和[china-area-data](https://github.com/airyland/china-area-data) 格式一致，方便自己修改。
- `{ label: string; value: string; children: {...}[] }` 


**构建json**

`yarn build && yarn generate`

**直接在当前目录生成json**

`npx china-area-data-tencent`  

支持三个参数  

- -o 指定文件输出目录
- -u 指定腾讯地图的页面地址(万一页面迁移了是吧，什么你问我为什么不直接提供excel链接地址的参数？excel链接变动的比页面更频繁，看了眼23年一年就变了三次。有人用我再加参数- -)
- -s 指定页面中excel超链接的xpath
