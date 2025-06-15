import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./route/usersroute.js"
import sessionRouter from "./route/sessionsroute.js"
import trakingRouter from "./route/trakingroute.js"
import ngrok from "ngrok" // <– Tambahkan import ini

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const port = process.env.PORT || 3008

app.use("/users", userRouter)
app.use("/sessions", sessionRouter)
app.use("/tracking", trakingRouter)

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
})
