# china-china-area-data-tencent

腾讯地图版本的中国行政区规划数据格式化，数据来源为腾讯地图官方网站，见以下[链接](https://lbs.qq.com/service/webService/webServiceGuide/webServiceDistrict)



**总共生成两个格式**  


- ` [countryCode:{provinceCode:'provinceName'},provinceCode:{cityCode:'cityName'},cityCode:{areaCode:'areaName'}]`  主要是为了和[china-area-data](https://github.com/airyland/china-area-data) 格式一致，
- `{ label: string; value: string; children: {...}[] }` 


**构建json**

`yarn build`

**直接在当前目录生成json**
