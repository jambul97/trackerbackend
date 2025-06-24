import db from "../config/db.js"

class AdminModel {
 async SignupModel({username, email, password}) {
  const {data, error} = await db.from("admin").insert([{username, email, password}])
  if (error) {
   throw new Error(error.message)
  }
  console.log("dari model", data)
  return data
 }

 async LoginModel(username) {
  const {data, error} = await db
   .from("admin")
   .select("*")
   .eq("username", username)
   .single()

  if (error) {
   console.log("error from model", error.message)
   throw new Error(error.message)
  }
  return data
 }

 async FindAdminModel({usernameOremail}) {
  const {data, error} = await db
   .from("admin")
   .select("*")
   .or(`username.eq.${usernameOremail},email.eq.${usernameOremail}`)
   .maybeSingle()

  if (error) {
   console.log("from model", error.message)
   throw new Error(error.message)
  }

  return data || null
 }
}

export default new AdminModel()
