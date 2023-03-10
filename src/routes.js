import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { dateFormat } from './utils/date-format.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title) {
        return res.writeHead(400).end(JSON.stringify('Preencha o títula da tarefa'))
      }

      if (!description) {
        return res.writeHead(400).end(JSON.stringify('Preencha a descrição da tarefa'))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: dateFormat(Date.now()),
        updated_at: null,
      }

      database.insert('tasks', task)

      res.writeHead(200).end(JSON.stringify('Tarefa criada com sucesso'))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const taskFound = database.update('tasks', id, {
        title,
        description,
        updated_at: dateFormat(Date.now())
      })

      if (taskFound) {
        return res.writeHead(200).end(JSON.stringify('Task atualizada com sucesso'))
      }

      return res.writeHead(400).end(JSON.stringify('Task não encontrada'))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const taskFound = database.patch('tasks', id, { completed_at: dateFormat(Date.now()) })

      if (taskFound) {
        return res.writeHead(200).end(JSON.stringify('Task completada com sucesso'))
      }

      return res.writeHead(400).end(JSON.stringify('Task não encontrada'))

    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const taskFound = database.delete('tasks', id)

      if (taskFound) {
        return res.writeHead(200).end(JSON.stringify('Tarefa deletada com sucesso'))
      }

      return res.writeHead(400).end(JSON.stringify('Tarefa não encontrada'))
    }
  },
]