import db from "../config/db.js"

class AdminModel {
 async SignupModel({username, email, password}) {
  const {data, error} = await db.from("admin").insert({username, email, password})
  if (error) {
   throw new Error(error.message)
  }
  return data
 }

 async LoginModel({usernameOremail}) {
  const {data, error} = await db
   .from("admin")
   .select("*")
   .or(`username.eq.${usernameOremail},email.eq.${usernameOremail}`)
   .maybeSingle()

  if (error) {
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
   throw new Error(error.message)
  }
  return data
 }
}

export default new AdminModel()
