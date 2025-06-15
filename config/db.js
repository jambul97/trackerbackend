import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const db = createClient(supabaseUrl, supabaseKey, {
 auth: {
  persistSession: false
 },

 global: {
  fetch: (url, options) => {
   const timeout = 10000
   const controller = new AbortController()
   const timoutid = setTimeout(() => controller.abort(), timeout)

   return fetch(url, {
    ...options,
    signal: controller.signal
   }).finally(() => clearTimeout(timoutid))
  },
  realtime: {
   timeout: 10000 // 10 detik timeout untuk koneksi realtime
  }
 }
})

export default db;