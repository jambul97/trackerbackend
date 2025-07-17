import express from "express"
import RegisterController from "../controller/registercontroller.js"
import UserBookingMiddleware from "../middleware/user_booking.js" // ✅ middleware JWT

const router = express.Router()

router.post("/", UserBookingMiddleware.verifyToken, RegisterController.CreateRegisterController)
router.post("/approve/:register_id", RegisterController.ApproveRegisterController)
router.get("/", RegisterController.GetAllRegisterController)
// router.get("/my", UserBookingMiddleware.verifyToken, RegisterController.GetRegisterByIdController)


export default router
