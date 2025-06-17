import {createClient} from "@supabase/supabase-js"
import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
 dotenv.config() // Hanya load .env saat di lokal
}

// console.log("SUPABASE_URL:", process.env.SUPABASE_URL) // debug
// console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY) // debug

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
 throw new Error("❌ SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak diset")
}

const db = createClient(supabaseUrl, supabaseKey, {
 auth: {
  persistSession: false
 },
 global: {
  fetch: (url, options) => {
   const timeout = 10000
   const controller = new AbortController()
   const timeoutId = setTimeout(() => controller.abort(), timeout)
   return fetch(url, {
    ...options,
    signal: controller.signal
   }).finally(() => clearTimeout(timeoutId))
  },
  realtime: {
   timeout: 10000
  }
 }
})

export default db
