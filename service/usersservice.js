import UserModel from "../model/usersmodel.js"
import {OAuth2Client} from "google-auth-library"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

class UsersService {
 async SignUpUserService({nama, alamat, tanggal_lahir, umur, username, email, password, telepon}) {
  const existingUser = await UserModel.FindUserByUsernameAndEmailModel({username, email})

  if (existingUser.length > 0) {
   throw new Error("Username atau email sudah terdaftar")
  }

  if (!email.includes("@gmail.com")) {
   throw new Error("Email harus menggunakan domain gmail.com")
  }

  if (password.length < 6) {
   throw new Error("Password minimal 6 karakter")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await UserModel.SignupUserModel({
   nama,
   alamat,
   tanggal_lahir,
   umur,
   username,
   email,
   password: hashedPassword,
   telepon
  })

  const newUser = await UserModel.FindUserByUsernameAndEmailModel({username, email})
  if (!newUser[0]) {
   throw new Error("Gagal mengambil data user setelah pendaftaran")
  }

  const token = jwt.sign({userId: newUser[0].id}, process.env.JWT_SECRET, {expiresIn: "7d"})
  return {username, email, token} // optional return
 }

 async LoginUserService({usernameOremail, password}) {
  const user = await UserModel.LoginUserModel({usernameOremail})
  if (!user || !user.password) {
   throw new Error("Username atau password salah")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
   throw new Error("Username atau password salah")
  }

  const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: "7d"})
  return {token, ...user}
 }

 async VerifyGoogleTokenService({token}) {
  const ticket = await client.verifyIdToken({
   idToken: token,
   audience: process.env.GOOGLE_CLIENT_ID
  })
  if (!ticket) {
   throw new Error("Token tidak valid")
  }
  if (!ticket.getPayload().email_verified) {
   throw new Error("Email tidak terverifikasi")
  }
  const payload = ticket.getPayload()
  return payload
 }

 async GoogleLoginService({email}) {
  const existingUser = await UserModel.FindUserByUsernameAndEmailModel({email})
  if (existingUser.length > 0) {
   const user = existingUser[0]
   const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: "7d"})
   return {token, user}
  }
  if (!email.includes("@gmail.com")) {
   throw new Error("Email harus menggunakan domain gmail.com")
  }
  const username = email.split("@")[0] + Math.floor(Math.random() * 1000)
  const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10)
  const nama = username
  const newUser = await UserModel.SignupUserModel({
   username: username,
   email,
   password: hashedPassword,
   nama: nama,
   alamat: null,
   tanggal_lahir: null,
   umur: null,
   telepon: null,
   provider: "google"
  })


  if (!newUser || newUser.length === 0) {
   throw new Error("Gagal membuat user baru")
  }

  const user = newUser[0]

  const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: "7d"})
  return {token, user}
 }

 async GetAllUserService() {
  const users = await UserModel.GetAllUserModel()
  return users
 }

 async GetUserByIdService({user_id}) {
  const user = await UserModel.GetUserByIdModel({user_id})
  if (!user) {
   throw new Error("User tidak ditemukan")
  }
  return user
 }

 async UpdateUserService({user_id, updatedData}) {
  const existingUser = await UserModel.GetUserByIdModel({user_id})
  if (!existingUser) {
   throw new Error("User tidak ditemukan")
  }
  await UserModel.UpdateUserDataModel(user_id, updatedData)
  const updatedUser = await UserModel.GetUserByIdModel({user_id})
  return updatedUser
 }

 async DeleteUserService({user_id}) {
  const existingUser = await UserModel.GetUserByIdModel({user_id})
  if (!existingUser) {
   throw new Error("User tidak ditemukan")
  }
  await UserModel.DeleteUserModel(user_id)
  return {message: "User berhasil dihapus"}
 }

 async ResetPasswordService({usernameOrEmail, password}) {
  const user = await UserModel.FindUserByUsernameAndEmailModel({usernameOrEmail})
  if (!user || user.length === 0) {
   throw new Error("User tidak ditemukan")
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  await UserModel.ResetPasswordModel({usernameOrEmail, password: hashedPassword})
  return {message: "Password berhasil direset"}
 }
}

export default new UsersService()
