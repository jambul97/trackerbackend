import UserModel from "../model/usersmodel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
  return {token, username: user.username, user_id: user.user_id}
 }
}

export default new UsersService()
