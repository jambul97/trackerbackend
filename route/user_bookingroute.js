import express from "express"
import UserBookingController from "../controller/user_bookingcontroller.js"
import UserBookingMiddleware from "../middleware/user_booking.js" // ✅ middleware JWT

const router = express.Router()

router.post("/signup", UserBookingController.SignUpUserBookingController)
router.post("/login", UserBookingController.LoginUserBookingController)
router.get("/my", UserBookingMiddleware.verifyToken, UserBookingController.GetRegisterByUserBookingController)


export default router
