// src/setup/globalTeardown.ts
import { pgPoolData } from '../db/pg.client'
import Log from '../utils/logger'

export default async function globalTeardown() {
  await pgPoolData.end()
  Log.info('🧹 Global Teardown Completed')
}
