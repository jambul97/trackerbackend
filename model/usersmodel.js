import db from "../config/db.js"

class UsersModel {
 async SignupUserModel({nama, alamat, tanggal_lahir, umur, username, email, password, telepon}) {
  const {data, error} = await db
   .from("users")
   .insert([{nama, alamat, tanggal_lahir, umur, username, email, password, telepon}], {returning: false})

  if (error) {
   throw new Error(error.message)
  }
  return data // opsional, kalau mau return hasil insert
 }

 async FindUserByUsernameAndEmailModel({username, email}) {
  const {data, error} = await db.from("users").select("*").or(`username.eq.${username},email.eq.${email}`)

  if (error) {
   throw new Error(error.message)
  }

  return data
 }

 async LoginUserModel({usernameOremail}) {
  const {data, error} = await db
   .from("users")
   .select("*")
   .or(`username.eq.${usernameOremail},email.eq.${usernameOremail}`)
   .maybeSingle()

  if (error) {
   throw new Error(error.message)
  }

  return data
 }
}

export default new UsersModel()
