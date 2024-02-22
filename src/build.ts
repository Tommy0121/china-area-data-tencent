import { PPRun } from "./buildData";
import { DATA_DIR } from './generator'
import fs from 'fs'

PPRun().then((res) => {
  if (res) {
    const { tree, data } = res
    const path = DATA_DIR
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });

    }
    const treeFile = `${DATA_DIR}/tree.json`;
    const dataFile = `${DATA_DIR}/data.json`;
    fs.writeFileSync(treeFile, JSON.stringify(tree, null, 2));
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
})