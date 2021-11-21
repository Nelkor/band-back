import { createConnection, Connection, ResultSetHeader } from 'mysql2/promise'

import { log } from '.'

type QueryValues = (string | number | null)[]

let connection: Connection

const connect = async (): Promise<void> => {
  connection = await createConnection({
    host: 'db',
    user: 'root',
    password: 'secret',
    database: 'player',
  })
}

const query = async (
  sql: string,
  values: QueryValues = []
): Promise<unknown[]> => {
  try {
    return connection.query(sql, values)
  } catch (e) {
    await connect()

    log('db is connected')

    return connection.query(sql, values)
  }
}

export const queryData = async <T>(
  sql: string,
  values: QueryValues = []
): Promise<T[]> => {
  const [rows] = await query(sql, values)

  return (Array.isArray(rows) ? rows : []) as T[]
}

export const queryAction = async (
  sql: string,
  values: QueryValues = []
): Promise<ResultSetHeader> => {
  const [result] = await query(sql, values)

  return result as ResultSetHeader
}
