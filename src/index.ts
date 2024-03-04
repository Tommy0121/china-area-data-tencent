#!/usr/bin/env node

import { program } from 'commander';
import { PPRun } from './buildData'
import fs from 'fs'
import path from 'path'


program.name('china-area-data-tencent')
  .version(`${process.env.npm_package_version}`);
program
  .option('-u --url <url>')
  .option('-o --output <output>')
  .option('-s --selector <selector>');


program.parse(process.argv);

const options = program.opts();


const run = async () => {

  const result = await PPRun(options.url, options.selector)
  if (result) {
    const { tree, data } = result
    const p = options.output || process.cwd()

    const DATA_DIR = path.resolve(p, './dist')
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }


    const treeFile = `${DATA_DIR}/tree.json`;
    const dataFile = `${DATA_DIR}/data.json`;
    fs.writeFileSync(treeFile, JSON.stringify(tree, null, 2));
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
}

run()