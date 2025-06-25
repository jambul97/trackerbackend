import SessionService from "../service/sessionsservice.js"

class SessionController {
 async CreateSessionController(req, res) {
  try {
   const {user_id, jalur_id, nama_jalur} = req.body
   const result = await SessionService.CreateSessionService({user_id, jalur_id, nama_jalur})
   return res.status(200).json({message: "Pendakian Anda dimulai", data: result})
  } catch (error) {
   return res.status(500).json({message: error.message})
  }
 }

 async EndSessionController(req, res) {
  try {
   const {tracking_session_id} = req.body
   if (!tracking_session_id) {
    return res.status(400).json({message: "tracking_session_id is required"})
   }
   const result = await SessionService.EndSessionService({tracking_session_id})
   return res.status(200).json({message: "Pendakian Anda berakhir", data: result})
  } catch (error) {
   return res.status(500).json({message: error.message})
  }
 }

 async SleepSessionController(req, res) {
  try {
   const {tracking_session_id, status} = req.body
   const result = await SessionService.SleepSessionService({tracking_session_id, status})
   return res.status(200).json({message: "pendakian anda akan di pause", data: result})
  } catch (error) {
   return res.status(500).json({message: error.message})
  }
 }

 async GetSessionController(req, res) {
  try {
   const sessions = await SessionService.GetSessionService()
   return res.status(200).json(sessions)
  } catch (error) {
   return res.status(500).json({message: error.message})
  }
 }

 async GetSessionByIdController(req, res) {
  try {
   const {tracking_session_id} = req.params
   const session = await SessionService.GetSessionByIdService(tracking_session_id)
   return res.status(200).json(session)
  } catch (error) {
   return res.status(500).json({message: error.message})
  }
 }

 async GetSessionByUserIdController(req, res) {
  try {
   const {user_id} = req.params
   const session = await SessionService.GetSessionByUserIdService(user_id)
   return res.status(200).json(session)
  } catch (error) {
   return res.status(500).json({message: error.message})
  }
 }
}

export default new SessionController()
