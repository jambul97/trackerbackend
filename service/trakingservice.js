import TrakingModel from "../model/trakingmodel.js"
import db from "../config/db.js"
import {getLocalTimestamp, convertToLocal} from "../utils/time.js"

class TrakingService {
 async CreateTrakingService({
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
  try {
   timestamp = convertToLocal(timestamp)
   if (!tracking_session_id) {
    throw new Error("tracking_session_id is required")
   }

   // Validate session exists and is active
   const session = await db
    .from("tracking_sessions")
    .select()
    .eq("tracking_session_id", tracking_session_id)
    .is("end_time", null)
    .single()

   if (!session) {
    throw new Error("Invalid or inactive tracking session")
   }

   if (id_pos === null) {
    id_pos = null
    nama_pos = "dalam pendakian"
   }

   const tracking = await TrakingModel.CreateTrakingModel({
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
   return tracking
  } catch (error) {
   throw new Error(error.message)
  }
 }

 async InsertTrakingBatchService(trakingdata) {
  try {
   if (!Array.isArray(trakingdata) || trakingdata.length === 0) {
    throw new Error("Invalid tracking data format")
   }

   const validLogs = []

   for (const log of trakingdata) {
    const {tracking_session_id, timestamp, latitude, longitude, jalur_id, nama_jalur, id_pos, nama_pos, keterangan} =
     log

    // ✅ Cek session aktif
    const session = await db
     .from("tracking_sessions")
     .select()
     .eq("tracking_session_id", tracking_session_id)
     .is("end_time", null)
     .single()

    if (!session) continue // ❌ skip log kalau session tidak valid

    // ⏳ Convert timestamp
    const localTimestamp = convertToLocal(timestamp)

    validLogs.push({
     tracking_session_id,
     timestamp: localTimestamp,
     latitude,
     longitude,
     jalur_id,
     nama_jalur,
     id_pos: id_pos === null ? null : id_pos,
     nama_pos: id_pos === null ? "dalam pendakian" : nama_pos,
     keterangan
    })
   }

   if (validLogs.length === 0) {
    throw new Error("Tidak ada log yang valid untuk disimpan")
   }

   const result = await TrakingModel.insertTrakingBatchModel(validLogs)
   return result
  } catch (error) {
   throw new Error(error.message)
  }
 }

 async GetTrakingService() {
  try {
   const tracking = await TrakingModel.GetTrakingModel()
   if (!tracking || tracking.length === 0) {
    return null
   }
   return tracking
  } catch (error) {
   throw new Error(error.message)
  }
 }

 async GetTrakingByUserIdService(user_id) {
  try {
   const tracking = await TrakingModel.GetTrakingByUserIdModel(user_id)
   if (!tracking || tracking.length === 0) {
    return null
   }
   return tracking
  } catch (error) {
   throw new Error(error.message)
  }
 }
}

export default new TrakingService()
