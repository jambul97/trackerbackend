import UserBookingService from "../service/user_bookingservice.js"

class UserBookingController {
 async SignUpUserBookingController(req, res) {
  try {
   const {email, password} = req.body
   const user = await UserBookingService.UserBookingSignupService({email, password})
   return res.status(201).json({
    message: "User created successfully",
    user
   })
  } catch (error) {
   return res.status(400).json({
    message: error.message
   })
  }
 }
 async LoginUserBookingController(req, res) {
  try {
   const {email, password} = req.body
   const user = await UserBookingService.UserBookingLoginService({email, password})
   const token = user.token
   return res.status(200).json({
    message: "User logged in successfully",
    user,
    token
   })
  } catch (error) {
   return res.status(400).json({
    message: error.message
   })
  }
 }
 async GetRegisterByUserBookingController(req, res) {
  try {
   const users_booking_id = req.user.userId
   const result = await UserBookingService.GetRegisterByUserBookingService(users_booking_id)
   res.status(200).json({success: true, data: result})
  } catch (err) {
   res.status(400).json({success: false, message: err.message})
  }
 }
}

export default new UserBookingController()
