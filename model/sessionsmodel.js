import db from "../config/db.js"

class SessionModel {
 async CreateSessionModel({user_id, start_time, jalur_id, nama_jalur, status}) {
  const {data, error} = await db
   .from("tracking_sessions")
   .insert({user_id, jalur_id, nama_jalur, start_time, status})
   .select()

  if (error) {
   throw new Error(error.message)
  }
  return data
 }

 async EndSessionModel({tracking_session_id, end_time, status}) {
  const {data, error} = await db
   .from("tracking_sessions")
   .update({end_time, status})
   .eq("tracking_session_id", tracking_session_id)
   .is("end_time", null)
   .select()

  if (error) {
   throw new Error(error.message)
  }

  if (!data || data.length === 0) {
   throw new Error("Session not found or already ended")
  }

  return data
 }

 async SleepSessionModel({tracking_session_id, status}) {
  const {data, error} = await db
   .from("tracking_sessions")
   .update({status})
   .eq("tracking_session_id", tracking_session_id)
   .select()

   if (error) {
    throw new Error(error.message)
   }

   return data
 }

 async GetSessionModel() {
  const {data, error} = await db.from("tracking_sessions").select()

  if (error) {
   throw new Error(error.message)
  }

  return data
 }

 async GetSessionByIdModel(tracking_sessions_id) {
  const {data, error} = await db.from("tracking_sessions").select().eq("tracking_sessions_id", tracking_sessions_id)

  if (error) {
   throw new Error(error.message)
  }

  return data
 }

 async GetSessionByUserIdModel(user_id) {
  const {data, error} = await db.from("tracking_sessions").select().eq("user_id", user_id)

  if (error) {
   throw new Error(error.message)
  }

  return data
 }
}

export default new SessionModel()
