import { Verify, verify } from "crypto"
import UsersService from "../service/usersservice.js"

class UsersController {
    async SignUpUserController(req, res) {
        try {
            const { nama, alamat, tanggal_lahir, umur, username, email, password, telepon, kontak_darurat, jenis_kelamin } = req.body

            const user = await UsersService.SignUpUserService({
                nama,
                alamat,
                tanggal_lahir,
                umur,
                username,
                email,
                password,
                telepon,
                kontak_darurat,
                jenis_kelamin,

            })
            res.status(201).json({
                success: true,
                message: "Berhasil membuat akun",
                token: user.token,
                user
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    async LoginUserController(req, res) {
        try {
            const { usernameOremail, password } = req.body
            const user = await UsersService.LoginUserService({ usernameOremail, password })
            const { token, ...userData } = user
            res.status(200).json({
                success: true,
                message: "Berhasil login",
                token: user.token,
                user: userData
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    async GoogleLoginController(req, res) {
        try {
            const { token } = req.body

            if (!token) {
                return res.status(400).json({ message: "Token tidak valid" })
            }

            // Verifikasi token Google dan ambil data user dari Google
            const payload = await UsersService.VerifyGoogleTokenService({ token })

            // Login atau daftar jika user belum ada
            const { token: jwtToken, user } = await UsersService.GoogleLoginService({
                email: payload.email,
                name: payload.name
            })

            return res.status(200).json({
                success: true,
                message: "Berhasil login",
                token: jwtToken,
                user
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    async GetAllUserController(req, res) {
        try {
            const users = await UsersService.GetAllUserService()
            res.status(200).json({
                success: true,
                message: "Berhasil mengambil data user",
                users
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    async GetUserByIdController(req, res) {
        try {
            const { user_id } = req.params
            const user = await UsersService.GetUserByIdService({ user_id })
            res.status(200).json({
                success: true,
                message: "Berhasil mengambil data user",
                user
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    async UpdateUserController(req, res) {
        try {
            const { user_id } = req.params
            const { username, email, password, nama, alamat, tanggal_lahir, umur, telepon } = req.body
            const updatedData = {
                username,
                email,
                password,
                nama,
                alamat,
                tanggal_lahir,
                umur,
                telepon
            }
            const user = await UsersService.UpdateUserService({ user_id,updatedData })
            res.status(200).json({
                success: true,
                message: "Berhasil mengupdate data user",
                user
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    async DeleteUserController(req, res) {
        try {
            const { user_id } = req.params
            const user = await UsersService.DeleteUserService({ user_id })
            res.status(200).json({
                success: true,
                message: "Berhasil menghapus data user",
                user
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    async ResetPasswordController(req, res) {
        try {
            const { usernameOrEmail, password } = req.body
            const user = await UsersService.ResetPasswordService({ usernameOrEmail, password })
            res.status(200).json({
                success: true,
                message: "Berhasil mereset password",
                user
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

}
export default new UsersController()
