// src/setup/globalSetup.ts

import Log from '../utils/logger'
import { ENV } from '../helper/env/env.config'
import axios from 'axios'
import { pgPoolData } from '../db/pg.client'

export default async function globalSetup() {

  Log.info('🚀 GLOBAL SETUP STARTED')
  Log.info(`🌍 Environment: ${ENV.SYS_ENV || 'local'}`)

  /**
   * 1️⃣ Validate critical environment variables
   */
  if (!ENV.BASE_API_URL) {
    throw new Error('❌ BASE_API_URL is not defined')
  }else{
    Log.info(`🌍 BASE_API_URL: ${ENV.BASE_API_URL}`)
  }

//   /**
//    * 2️⃣ Warm up API (health check)
//    * This avoids first-call latency issues
//    */
//   const apiHealth = await axios.get(`${ENV.BASE_API_URL}/health`)
//   if (!apiHealth) {
//     throw new Error('❌ BASE_API_URL connection not healthy')
//   }

  /**
   * 3️⃣ Optional: Seed database
   * If you want baseline data before test run
   */
  const data = await pgPoolData.query('SELECT 1')
  if (!data) {
    throw new Error('❌ SSO Db connection not healthy')
  }
  Log.info('✅ GLOBAL SETUP COMPLETED')
}
