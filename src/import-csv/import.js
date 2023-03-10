import fs from 'node:fs'
import { parse } from 'csv-parse'

const processFile = async () => {

  const parser = fs.createReadStream(`src/import-csv/tasks.csv`).pipe(parse())
  let ignoreFirstLine = false

  for await (const records of parser) {
    if (ignoreFirstLine) {
      fetch('http://localhost:3333/tasks', {
        method: 'POST',
        body: JSON.stringify(({
          title: records[0],
          description: records[1]
        })),
      })
    }
    ignoreFirstLine = true
  }
}

(async () => {
  await processFile()
})()
