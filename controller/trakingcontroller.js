import TrakingService from "../service/trakingservice.js"

const rateLimiter = {
    requestTimestamps: {},
    requestcount: {},
    maxRequestPerWindow: 100,
    windowMs: 60 * 1000,

    isRateLimited(ip) {
        const now = Date.now()

        if (!this.requestcount[ip]) {
            this.requestcount[ip] = 0
            this.requestTimestamps[ip] = now
        }

        if (now - this.requestTimestamps[ip] > this.windowMs) {
            this.requestcount[ip] = 0
            this.requestTimestamps[ip] = now
        }

        if (this.requestcount[ip] >= this.maxRequestPerWindow) {
            return true
        }

        this.requestcount[ip]++
        return false
    }
}
class TrakingController {
    async CreateTrakingController(req, res) {
        try {
            const {
             tracking_session_id,
             timestamp,
             latitude,
             longitude,
             accuracy,
             jalur_id,
             nama_jalur,
             id_pos,
             nama_pos,
             keterangan
            } = req.body

            const result = await TrakingService.CreateTrakingService({
                tracking_session_id,
                timestamp,
                latitude,
                longitude,
                accuracy,
                jalur_id,
                nama_jalur,
                id_pos,
                nama_pos,
                keterangan
            })
            res.status(200).json({ messege: "log berhasil di tambahkan", data: result })
        } catch (error) {
            res.status(500).json({ messege: error.message })
        }
    }

    async InsertTrakingBatchController(req, res) {
        try {
            const clientIp = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress
            if (rateLimiter.isRateLimited(clientIp)) {
                return res.status(429).json({ messege: "Rate limit exceeded", retryAfter: Math.ceil(rateLimiter.windowMs / 1000) })
            }
            const trakingdata = req.body
            const result = await TrakingService.InsertTrakingBatchService(trakingdata)
            res.status(200).json({ messege: "log berhasil di tambahkan", data: result })
        } catch (error) {
            res.status(500).json({ messege: error.message })
        }
    }

    async GetTrakingController(req, res) {
        try {
            const result = await TrakingService.GetTrakingService()
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ messege: error.message })
        }
    }

    async GetTrakingByUserIdController(req, res) {
        try {
            const user_id = req.params.user_id
            const result = await TrakingService.GetTrakingByUserIdService(user_id)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ messege: error.message })
        }
    }
}
export default new TrakingController()