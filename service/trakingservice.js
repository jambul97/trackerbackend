import TrakingModel from "../model/trakingmodel.js"
import db from "../config/db.js"
class TrakingService {
    async CreateTrakingService({ tracking_session_id, timestamp, latitude, longitude, jalur_id, nama_jalur, id_pos, nama_pos }) {
        try {

            if (!tracking_session_id) {
                throw new Error("tracking_session_id is required")
            }

            // Validate session exists and is active
            const session = await db
                .from("tracking_sessions")
                .select()
                .eq("tracking_session_id", tracking_session_id)
                .is("end_time", null)
                .single()

            if (!session) {
                throw new Error("Invalid or inactive tracking session")
            }

            if (id_pos === null) {
                id_pos = null
                nama_pos = "dalam pendakian"
            }

            const tracking = await TrakingModel.CreateTrakingModel({
                tracking_session_id,
                timestamp,
                latitude,
                longitude,
                jalur_id,
                nama_jalur,
                id_pos,
                nama_pos
            })
            return tracking
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async InsertTrakingBatchService(trakingdata) {
        try {
            if (!Array.isArray(trakingdata) || trakingdata.length === 0) {
                throw new Error("Invalid tracking data format")
            }

            const tracking_session_id = trakingdata[0].tracking_session_id
            if (!tracking_session_id) {
                throw new Error("tracking_session_id is required")
            }

            // Validate session exists and is active
            const session = await db
                .from("tracking_sessions")
                .select()
                .eq("tracking_session_id", tracking_session_id)
                .is("end_time", null)
                .single()

            if (!session) {
                throw new Error("Invalid or inactive tracking session")
            }

            const processedData = trakingdata.map((tracking) => ({
                ...tracking,
                id_pos: tracking.id_pos === null ? null : tracking.id_pos,
                nama_pos: tracking.id_pos === null ? "dalam pendakian" : tracking.nama_pos
            }))

            await TrakingModel.insertTrakingBatchModel(processedData)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async GetTrakingService() {
        try {
            const tracking = await TrakingModel.GetTrakingModel()
            if (!tracking || tracking.length === 0) {
                return null
            }
            return tracking
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async GetTrakingByUserIdService(user_id) {
        try {
            const tracking = await TrakingModel.GetTrakingByUserIdModel(user_id)
            if (!tracking || tracking.length === 0) {
                return null
            }
            return tracking
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new TrakingService()
