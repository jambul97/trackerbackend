import nodemailer from "nodemailer"
import dotenv from "dotenv"
import axios from "axios"
dotenv.config()

const transporter = nodemailer.createTransport({
 service: "gmail",
 auth: {
  user: process.env.SMTP_EMAIL,
  pass: process.env.SMTP_PASSWORD
 }
})

export async function sendLoginEmail({email, username, password, nama}) {
 await transporter.sendMail({
  from: `"e-SIMAKSI-LAWU" <${process.env.SMTP_EMAIL}>`,
  to: email,
  subject: "Akun Login Tracking SIMAKSI",
  html: `
      <p>Halo <strong>${nama}</strong>,</p>
      <p>Akun Anda telah dibuat:</p>
      <ul>
        <li>Username: <strong>${username}</strong></li>
        <li>Password: <strong>${password}</strong></li>
      </ul>
      <p>Gunakan akun ini untuk login ke aplikasi tracking.</p>
    `
 })
}

// export async function sendBookingEmail({email, nama, fileUrl}) {
//  await transporter.sendMail({
//   from: `"SIMAKSI" <${process.env.SMTP_EMAIL}>`,
//   to: email,
//   subject: "Bukti Booking SIMAKSI Anda",
//   html: `<p>Halo ${nama},<br/>Berikut bukti booking Anda: <a href="${fileUrl}" target="_blank">Download PDF</a></p>`
//  })
// }

export async function sendBookingEmail({email, nama, pdfUrl}) {
 // Ambil PDF dari URL Supabase sebagai buffer
 const response = await axios.get(pdfUrl, {responseType: "arraybuffer"})
 const pdfBuffer = Buffer.from(response.data, "binary")

 // Kirim email dengan PDF sebagai lampiran dan juga link download
 await transporter.sendMail({
  from: `"e-SIMAKSI-LAWU" <${process.env.SMTP_EMAIL}>`,
  to: email,
  subject: "Bukti Booking SIMAKSI Anda",
  html: `
      <p>Halo <strong>${nama}</strong>,</p>
      <p>Berikut kami lampirkan bukti booking Anda dalam bentuk file PDF.</p>
      <p>Terima kasih telah menggunakan layanan SIMAKSI.</p>
    `,
  attachments: [
   {
    filename: "bukti-booking.pdf",
    content: pdfBuffer,
    contentType: "application/pdf"
   }
  ]
 })
}
