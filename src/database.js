import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    const taskData = this.#database[table][rowIndex] ?? []

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        id,
        title: data.title ? data.title : taskData.title,
        description: data.description ? data.description : taskData.description,
        completed_at: null,
        created_at: taskData.created_at,
        updated_at: data.updated_at
      }
      this.#persist()
      return true
    }

    return false
  }

  patch(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    const taskData = this.#database[table][rowIndex] ?? []

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        id,
        title: data.title ? data.title : taskData.title,
        description: data.description ? data.description : taskData.description,
        completed_at: data.completed_at,
        created_at: taskData.created_at,
        updated_at: taskData.updated_at
      }
      this.#persist()
      return true
    }
    return false
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
      return true
    }

    return false
  }
}