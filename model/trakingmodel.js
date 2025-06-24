import db from "../config/db.js"

class TrakingModel {
 async CreateTrakingModel({
  tracking_session_id,
  timestamp,
  latitude,
  longitude,
  jalur_id,
  nama_jalur,
  id_pos,
  nama_pos,
  keterangan
 }) {
  // Validate tracking_session_id exists
  const session = await db.from("tracking_sessions").select().eq("tracking_session_id", tracking_session_id).single()

  if (!session) {
   throw new Error("Invalid tracking_session_id")
  }

  const {data, error} = await db
   .from("tracking_log")
   .insert({
    tracking_session_id,
    timestamp,
    latitude,
    longitude,
    jalur_id,
    nama_jalur,
    id_pos,
    nama_pos,
    keterangan
   })
   .select()

  if (error) {
   throw new Error(error.message)
  }

  return data
 }

 async insertTrakingBatchModel(trakingdata) {
  try {
   if (!Array.isArray(trakingdata) || trakingdata.length === 0) {
    throw new Error("Invalid tracking data format")
   }

   const max_batch = 100
   const result = []

   for (let i = 0; i < trakingdata.length; i += max_batch) {
    const batch = trakingdata.slice(i, i + max_batch)

    const {data, error} = await db.from("tracking_log").insert(batch).select()

    if (error) {
     throw new Error(error.message)
    }

    result.push(...(data || []))

    if (i + max_batch < trakingdata.length) {
     await new Promise((resolve) => setTimeout(resolve, 1000)) // throttle
    }
   }

   return result
  } catch (error) {
   throw new Error("Insert tracking batch failed: " + error.message)
  }
 }

 async GetTrakingModel() {
  const {data, error} = await db.from("tracking_log").select()

  if (error) {
   throw new Error(error.message)
  }

  return data
 }

 async GetTrakingByUserIdModel(user_id) {
  const {data, error} = await db
   .from("users")
   .select(
    `
            user_id,
            nama,
            telepon,
            tracking_session:tracking_sessions(
              tracking_session_id,
              start_time,
              end_time,
              status,
              tracking_log(
                tracking_log_id,
                tracking_session_id,
                timestamp,
                latitude,
                longitude,
                jalur_id,
                nama_jalur,
                id_pos,
                nama_pos
              )
            )
          `
   )
   .eq("user_id", user_id)

  if (error) {
   throw new Error(error.message)
  }

  return data
 }
}

export default new TrakingModel()
