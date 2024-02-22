import { PPRun } from "./buildData";
import path from 'path'
import fs from 'fs'

export const DATA_DIR = path.resolve(__dirname, '../dist/data')

export default (dirPath:string) => {
  PPRun().then((res) => {
    if (res) {
      const { tree, data } = res
      const path = dirPath || DATA_DIR
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });

      }
      const treeFile = `${DATA_DIR}/tree.json`;
      const dataFile = `${DATA_DIR}/data.json`;
      fs.writeFileSync(treeFile, JSON.stringify(tree, null, 2));
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    }
  })
}
