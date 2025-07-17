import db from "../config/db.js"

class UserBookingModel {
 async FindUserBookingModel({email}) {
  const {data, error} = await db.from("users_booking").select("*").eq("email", email)
  if (error) {
   throw new Error(error.message)
  }
  return data
 }
 async SignUpUserBookingModel({email, password}) {
  const {data, error} = await db.from("users_booking").insert({email, password})
  if (error) {
   throw new Error(error.message)
  }
  return data
 }
 async LoginUserBookingModel({email}) {
  const {data, error} = await db.from("users_booking").select("*").eq("email", email).single()
  if (error) {
   throw new Error(error.message)
  }
  return data
 }

 async GetRegisterByUserBookingIdModel(users_booking_id) {
  const {data, error} = await db
   .from("register")
   .select("*")
   .eq("users_booking_id", users_booking_id)
   .order("created_at", {ascending: false})

  if (error) {
   throw new Error(error.message)
  }
  return data
 }
}

export default new UserBookingModel()
