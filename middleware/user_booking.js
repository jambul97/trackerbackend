import jwt from "jsonwebtoken"

class UserBookingMiddleware {
 async verifyToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
   return res.status(401).json({message: "Token tidak ditemukan"})
  }

  const token = authHeader.split(" ")[1]
  try {
   const decoded = jwt.verify(token, process.env.JWT_SECRET)
   req.user = decoded // ✅ simpan userId ke req.user.userId
   next()
  } catch (error) {
   return res.status(403).json({message: "Token tidak valid"})
  }
 }
}

export default new UserBookingMiddleware()
