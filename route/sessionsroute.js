import SessionController from "../controller/sessionscontroller.js"
import express from 'express'

const router = express.Router()

router.post("/start", SessionController.CreateSessionController)
router.post("/end", SessionController.EndSessionController)
router.get("/", SessionController.GetSessionController)
router.get("/:tracking_session_id", SessionController.GetSessionByIdController)
router.get("/user/:user_id", SessionController.GetSessionByUserIdController)

export default router