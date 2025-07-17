import PDFDocument from "pdfkit"
import fs from "fs"
import db from "../config/db.js"

export async function generateAndUploadPDF({register, pesertaList}) {
 const fileName = `bukti-registrasi-pendakian_${register.nama}_${Date.now()}.pdf`
 const filePath = `./tmp/${fileName}`

 const now = new Date()
 const formattedDate = now.toLocaleDateString("id-ID", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
 })
 const formattedTime = now.toLocaleTimeString("id-ID", {
  hour: "2-digit",
  minute: "2-digit"
 })

 const footerText = `Dicetak: ${formattedDate} pukul ${formattedTime} WIB`

 // === KONFIGURASI ===
 const doc = new PDFDocument({size: "A4", margin: 30})
 const writeStream = fs.createWriteStream(filePath)
 doc.pipe(writeStream)

 const MARGIN = 10
 const HEADER_HEIGHT = 100
 const LOGO_WIDTH = 60
 const LOGO_HEIGHT = 60
 const logoPath = "./assets/agl.jpeg"
 const FOOTER_HEIGHT = 100
 const sponsorLogos = ["./assets/sponsor/arei.png", "./assets/sponsor/eiger.png", "./assets/sponsor/cozmeed.png"]

 // === Fungsi Footer ===
 function drawFooter(doc) {
  const footerY = doc.page.height - FOOTER_HEIGHT

  // === Background Hijau ===
  doc.save()
  doc.rect(0, footerY, doc.page.width, FOOTER_HEIGHT).fill("#00703C")

  // === “Didukung oleh” di atas logo sponsor ===
  const didukungY = footerY + 5
  doc
   .fillColor("#FFFFFF")
   .font("Helvetica")
   .fontSize(8)
   .text("Didukung oleh", MARGIN, didukungY, {
    align: "center",
    width: doc.page.width - 2 * MARGIN
   })

  // === Logo Sponsor di bawah teks “Didukung oleh” ===
  const SPONSOR_LOGO_WIDTH = 40
  const SPONSOR_LOGO_HEIGHT = 40
  const sponsorLogosY = didukungY + 10 // spacing bawah dari teks “Didukung oleh”

  const totalSponsor = sponsorLogos.length
  const totalWidth = totalSponsor * SPONSOR_LOGO_WIDTH + (totalSponsor - 1) * 10
  const startX = (doc.page.width - totalWidth) / 2

  sponsorLogos.forEach((path, index) => {
   const x = startX + index * (SPONSOR_LOGO_WIDTH + 10)
   if (fs.existsSync(path)) {
    doc.image(path, x, sponsorLogosY, {
     width: SPONSOR_LOGO_WIDTH,
     height: SPONSOR_LOGO_HEIGHT
    })
   } else {
    console.warn("Sponsor logo not found:", path)
   }
  })

  // === “Dicetak...” di paling bawah footer ===
  const printedTextY = sponsorLogosY + SPONSOR_LOGO_HEIGHT + 3
  doc
   .font("Helvetica")
   .fontSize(10)
   .text(footerText, MARGIN, printedTextY, {
    align: "center",
    width: doc.page.width - 1 * MARGIN
   })

  doc.restore()
 }

 function drawHeader(doc) {
  // Background hijau
  doc.save()
  doc.rect(0, 0, doc.page.width, HEADER_HEIGHT).fill("#00703C")
  doc.restore()

  // Teks tengah
  doc.fillColor("white").font("Helvetica-Bold").fontSize(20).text("BUKTI REGISTER PENDAKIAN", 0, 30, {align: "center"})

  doc.fontSize(14).text("E-SIMAKSI PENDAKIAN GUNUNG LAWU", {align: "center"})

  // Logo kiri
  if (fs.existsSync(logoPath)) {
   doc.image(logoPath, MARGIN, (HEADER_HEIGHT - LOGO_HEIGHT) / 2, {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT
   })
  } else {
   console.warn("Logo not found:", logoPath)
  }
 }

 // === HEADER ===
 drawHeader(doc)

 // === INFORMASI PENDAKIAN ===
 doc.moveDown(2)
 doc
  .fillColor("#000")
  .font("Helvetica-Bold")
  .fontSize(15)
  .text("Informasi Registrasi Pendakian", {underline: true, align: "center"})

 doc.moveDown(1)
 doc.font("Helvetica").fontSize(11)

 const lineY = doc.y
 doc.text(`Tanggal Pendakian: ${register.tanggal_pendakian}`, MARGIN, lineY)
 doc.text(`Tanggal Turun: ${register.tanggal_turun}`, MARGIN, lineY, {
  align: "right",
  width: doc.page.width - 2 * MARGIN
 })
 doc.moveDown(1)

 // === JUDUL TABEL PESERTA ===
 const titleY = doc.y
 const titleHeight = doc.currentLineHeight() + 8
 doc
  .save()
  .rect(MARGIN, titleY - 3, doc.page.width - 2 * MARGIN, titleHeight)
  .fill("#e0e0e0")
  .restore()
 doc
  .fillColor("#000")
  .font("Helvetica-Bold")
  .fontSize(12)
  .text("Daftar Peserta", MARGIN, titleY, {
   align: "center",
   width: doc.page.width - 2 * MARGIN
  })
 doc.moveDown(0.5)

 // === HEADER TABEL ===
 const tableX = MARGIN
 const tableWidth = doc.page.width - 2 * MARGIN
 let y = doc.y

 function drawTableHeader(y) {
  doc.save().rect(tableX, y, tableWidth, 20).fill("#00703C").restore()
  doc.fillColor("white").font("Helvetica-Bold").fontSize(10)
  doc
   .text("NO", tableX + 5, y + 5)
   .text("NAMA PESERTA", tableX + 35, y + 5)
   .text("UMUR", tableX + 190, y + 5)
   .text("TELEPON", tableX + 260, y + 5)
   .text("KONTAK DARURAT", tableX + 370, y + 5)

  doc
   .moveTo(tableX, y)
   .lineTo(tableX + tableWidth, y)
   .stroke()
  doc
   .moveTo(tableX, y + 20)
   .lineTo(tableX + tableWidth, y + 20)
   .stroke()
 }

 drawTableHeader(y)
 y += 25

 // === ISI TABEL PESERTA ===
 doc.font("Helvetica").fillColor("#000")

 pesertaList.forEach((p, i) => {
  // Cek jika akan melewati batas bawah (termasuk footer)
  if (y + 20 > doc.page.height - FOOTER_HEIGHT - MARGIN) {
   drawHeader(doc)
   drawFooter(doc)
   doc.addPage()
   drawHeader(doc)
   y = HEADER_HEIGHT + 10
   drawTableHeader(y)
   y += 25
   doc.font("Helvetica").fillColor("#000")
  }

  doc
   .text(i + 1, tableX + 5, y)
   .text(p.nama, tableX + 35, y)
   .text(p.umur.toString(), tableX + 190, y)
   .text(p.telepon, tableX + 260, y)
   .text(p.kontak_darurat, tableX + 370, y)

  doc
   .moveTo(tableX, y + 15)
   .lineTo(tableX + tableWidth, y + 15)
   .stroke()
  y += 20
 })

 // === TOTAL BIAYA ===
 doc.moveDown(2)
 const total = pesertaList.length * 50000
 const totalY = doc.y
 const bgHeight = doc.currentLineHeight() + 10
 doc
  .save()
  .rect(MARGIN, totalY - 5, doc.page.width - 2 * MARGIN, bgHeight)
  .fill("#e0e0e0")
  .restore()

 doc.fillColor("#000").font("Helvetica-Bold").fontSize(12)
 doc.text("Total Biaya Simaksi:", MARGIN + 5, totalY)
 doc.text(`Rp ${total.toLocaleString("id-ID")}`, MARGIN + 5, totalY, {
  align: "right",
  width: doc.page.width - 2 * MARGIN - 10
 })
 doc
  .strokeColor("#999")
  .moveTo(MARGIN, totalY - 5)
  .lineTo(doc.page.width - MARGIN, totalY - 5)
  .stroke()
 doc
  .moveTo(MARGIN, totalY - 5 + bgHeight)
  .lineTo(doc.page.width - MARGIN, totalY - 5 + bgHeight)
  .stroke()

 doc.moveDown(2)
 doc
  .font("Helvetica")
  .fontSize(15)
  .text("Harap tunjukan bukti ini saat registrasi ulang di basecamp pendakian.", {align: "center"})

 // === Footer terakhir ===
 drawFooter(doc)
 doc.end()
 // ✅ Tunggu file selesai ditulis
 await new Promise((resolve, reject) => {
  writeStream.on("finish", resolve)
  writeStream.on("error", reject)
 })

 const buffer = fs.readFileSync(filePath)

 const upload = await db.storage.from("bukti-booking").upload(`bookings/${fileName}`, buffer, {
  contentType: "application/pdf",
  cacheControl: "3600",
  upsert: true
 })

 const {data, error} = db.storage.from("bukti-booking").getPublicUrl(`bookings/${fileName}`)

 if (error) throw new Error("Gagal ambil public URL: " + error.message)

 const publicUrl = data.publicUrl
 console.log("🎯 Fixed publicUrl:", publicUrl)

 fs.unlinkSync(filePath)
 return publicUrl
}
