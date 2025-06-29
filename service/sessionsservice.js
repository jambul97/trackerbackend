import sessionsmodel from "../model/sessionsmodel.js"
import SessionModel from "../model/sessionsmodel.js"
import {getLocalTimestamp} from "../utils/time.js"

class SessionService {
 async CreateSessionService({user_id, jalur_id, nama_jalur}) {
  try {
   const start_time = getLocalTimestamp()
   const status = "mulai pendakian"
   const session = await SessionModel.CreateSessionModel({user_id, start_time, jalur_id, nama_jalur, status})
   return session
  } catch (error) {
   throw new Error(error.message)
  }
 }

 async EndSessionService({tracking_session_id}) {
  try {
   if (!tracking_session_id) {
    throw new Error("tracking_session_id is required")
   }
   const end_time = getLocalTimestamp()
   const status = "pendakian berakhir"
   const session = await SessionModel.EndSessionModel({tracking_session_id, end_time, status})
   return session
  } catch (error) {
   throw new Error(error.message)
  }
 }

 async SleepSessionService({tracking_session_id, status}) {
  try {
   if (!tracking_session_id) {
    throw new Error("tracking_session_id is required")
   }
   const session = await SessionModel.SleepSessionModel({tracking_session_id, status})
   return session
  } catch (error) {
   throw new Error(error.message)
  }
 }

 async GetSessionService() {
  try {
   const sessions = await SessionModel.GetSessionModel()
   return sessions
  } catch (error) {
   throw new Error(error.message)
  }
 }
 async GetSessionByIdService(tracking_sessions_id) {
  try {
   const session = await SessionModel.GetSessionByIdModel(tracking_sessions_id)
   return session
  } catch (error) {
   throw new Error(error.message)
  }
 }

 async GetSessionByUserIdService(user_id) {
  try {
   const session = await SessionModel.GetSessionByUserIdModel(user_id)
   return session
  } catch (error) {
   throw new Error(error.message)
  }
 }
}

export default new SessionService()
