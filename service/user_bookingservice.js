import UserBookingModel from "../model/user_bookingmodel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class UserBookingService {
 async UserBookingSignupService({email, password}) {
  try {
   const existingUser = await UserBookingModel.FindUserBookingModel({email})
   if (existingUser.length > 0) {
    throw new Error("Email sudah terdaftar")
   }

   if (!email.includes("@gmail.com")) {
    throw new Error("Email harus menggunakan domain gmail.com")
   }

   if (password.length < 6) {
    throw new Error("Password minimal 6 karakter")
   }

   const hashedPassword = await bcrypt.hash(password, 10)
   const user = await UserBookingModel.SignUpUserBookingModel({email, password: hashedPassword})
   return user
  } catch (error) {
   throw new Error(error.message)
  }
 }

 async UserBookingLoginService({email, password}) {
  try {
   const result = await UserBookingModel.FindUserBookingModel({email})
   const user = result[0] // karena FindUserBookingModel mengembalikan array

   if (!user) {
    throw new Error("Email tidak terdaftar")
   }

   const isPasswordValid = await bcrypt.compare(password, user.password)
   if (!isPasswordValid) {
    throw new Error("Password salah")
   }

   const token = jwt.sign({userId: user.users_booking_id}, process.env.JWT_SECRET, {expiresIn: "7d"})
   return {token, ...user}
  } catch (error) {
   throw new Error(error.message)
  }
 }
 async GetRegisterByUserBookingService(users_booking_id) {
  try {
   const result = await UserBookingModel.GetRegisterByUserBookingIdModel(users_booking_id)
   return result
  } catch (error) {
   throw new Error(error.message)
  }
 }
}

export default new UserBookingService()
