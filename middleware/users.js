class UsersMiddleware {
 async SignupUserMiddleware(req, res, next) {
  try {
   const {nama, alamat, tanggal_lahir, umur, username, email, password, telepon} = req.body

   if (!nama || !alamat || !tanggal_lahir || !umur || !username || !email || !password ||!telepon) {
    return res.status(400).json({success: false, message: "Semua form harus diisi"})
   }

   if (nama.trim() === "" || username.trim() === "") {
    return res.status(400).json({success: false, message: "Nama dan username tidak boleh kosong atau hanya spasi"})
   }

   if (umur < 17) {
    return res.status(400).json({success: false, message: "Umur minimal 17 tahun"})
   }

   const usernameRegex = /^[a-zA-Z0-9_]+$/
   if (!usernameRegex.test(username)) {
    return res
     .status(400)
     .json({success: false, message: "Username hanya boleh mengandung huruf, angka, dan underscore"})
   }

   next()
  } catch (error) {
   return res.status(400).json({success: false, message: error.message})
  }
 }

 async LoginUserMiddleware(req, res, next) {
  try {
   const {usernameOremail, password} = req.body

   if (!usernameOremail ||!password) {
    return res.status(400).json({success: false, message: "Semua form harus diisi"})
   }

   next()
  } catch (error) {
   return res.status(400).json({success: false, message: error.message})
  }
 }

}

export default new UsersMiddleware()
