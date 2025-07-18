import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./route/usersroute.js"
import sessionRouter from "./route/sessionsroute.js"
import trakingRouter from "./route/trakingroute.js"
import adminRouter from "./route/adminroute.js"
import ngrok from "ngrok" // <– Tambahkan import ini
import RegisterRouter from "./route/registerroute.js"
import userBookingRouter from "./route/user_bookingroute.js"
import statusPendakianRouter from "./route/status_pendakianroute.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const port = process.env.PORT || 3001

app.use("/admin", adminRouter)
app.use("/users", userRouter)
app.use("/sessions", sessionRouter)
app.use("/tracking", trakingRouter)
app.use("/register", RegisterRouter)
app.use("/userbooking", userBookingRouter)
app.use("/statuspendakian", statusPendakianRouter)

app.use((err, req, res, next) => {
 console.error(err.stack)
 res.status(500).json({
  success: false,
  message: "Terjadi kesalahan pada server",
  error: process.env.NODE_ENV === "development" ? err.message : undefined
 })
})

app.listen(port, "0.0.0.0", async () => {
 console.log(`Server is running on http://0.0.0.0:${port}`)
 if (process.env.NODE_ENV === "development") {
  try {
   await ngrok.authtoken(process.env.NGROK_AUTHTOKEN)
   const url = await ngrok.connect({
    addr: port,
    proto: "http"
   })
   console.log("Ngrok URL:", url)
  } catch (error) {
   console.error("Ngrok error:", error)
  }
 }
})
