import db from "../config/db.js"

class UsersModel {
 async SignupUserModel({
  nama,
  alamat,
  tanggal_lahir,
  umur,
  username,
  email,
  password,
  telepon,
  kontak_darurat,
  register_id,
  jenis_kelamin
 }) {
  const {data, error} = await db
   .from("users")
   .insert([
    {nama, alamat, tanggal_lahir, umur, username, email, password, telepon, kontak_darurat, register_id, jenis_kelamin}
   ])

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

 async GetAllUserModel() {
  const {data, error} = await db.from("users").select("*")

  if (error) {
   throw new Error(error.message)
  }

  return data
 }

 async GetUserByIdModel({user_id}) {
  const {data, error} = await db.from("users").select("*").eq("user_id", user_id).maybeSingle()

  if (error) {
   throw new Error(error.message)
  }

  return data
 }

 async UpdateUserDataModel(user_id, updatedData) {
  const {data, error} = await db.from("users").update(updatedData).eq("user_id", user_id).select()

  if (error) {
   throw new Error(error.message)
  }
  return data
 }

 async DeleteUserModel(user_id) {
  const {data, error} = await db.from("users").delete().eq("user_id", user_id).select()
  if (error) {
   throw new Error(error.message)
  }
  return data
 }

 async ResetPasswordModel({usernameOrEmail, password}) {
  const {data, error} = await db
   .from("users")
   .update({password})
   .or(`username.eq.${usernameOrEmail},email.eq.${usernameOrEmail}`)
   .select()
  if (error) {
   throw new Error(error.message)
  }
  return data
 }
}

export default new UsersModel()
