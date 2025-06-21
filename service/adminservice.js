import AdminModel from "../model/adminmodel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class AdminService {
 async SignupService({username, email, password}) {
  try {
   const existingAdmin = await AdminModel.FindAdminModel({usernameOremail: username})
   if (existingAdmin.length > 0) {
    throw new Error("Admin sudah terdaftar")
   }
   if (!email.includes("@gmail.com")) {
    throw new Error("Email harus menggunakan domain gmail.com")
   }
   if (!username || !email || !password) {
    throw new Error("Semua field wajib diisi")
   }

   if (password.length < 6) {
    throw new Error("Password minimal 6 karakter")
   }
   const hashedPassword = await bcrypt.hash(password, 10)
   console.log(hashedPassword)
   const adminData = await AdminModel.SignupModel({username, email, password: hashedPassword})
   console.log(adminData)
   return adminData
  } catch (error) {
   console.log(error.message)
   throw error
  }
 }

 async LoginService({usernameOremail, password}) {
  const admin = await AdminModel.FindAdminModel({usernameOremail})
  if (!admin || !admin.password) {
   throw new Error("Username atau password salah")
  }
  const isPasswordValid = await bcrypt.compare(password, admin.password)
  if (!isPasswordValid) {
   throw new Error("Password salah")
  }
  const token = jwt.sign({adminId: admin.id}, process.env.JWT_SECRET, {expiresIn: "7d"})
  return {token, admin}
 }
}

export default new AdminService()
