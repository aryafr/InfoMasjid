import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendPaymentSuccessEmail = async (email, orderId, masjidId) => {
  if (!process.env.RESEND_API_KEY) {
    console.log("Resend API key missing, skipping email notification");
    return;
  }

  try {
    await resend.emails.send({
      from: 'InfoMasjid <noreply@infomasjid.com>',
      to: [email],
      subject: 'Pembayaran InfoMasjid Berhasil',
      html: `
        <div>
          <h2>Alhamdulillah, Pembayaran Berhasil</h2>
          <p>Terima kasih atas pembayaran Anda untuk layanan InfoMasjid TV.</p>
          <ul>
            <li><strong>Order ID:</strong> ${orderId}</li>
            <li><strong>ID Masjid:</strong> ${masjidId}</li>
          </ul>
          <p>Layar TV masjid Anda sekarang sudah aktif dan dapat digunakan.</p>
          <br />
          <p>Wassalamu'alaikum,</p>
          <p>Tim InfoMasjid</p>
        </div>
      `
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export const sendReminderEmail = async (email, masjidName, daysRemaining) => {
  if (!process.env.RESEND_API_KEY) {
    console.log("Resend API key missing, skipping reminder email notification");
    return;
  }

  try {
    await resend.emails.send({
      from: 'InfoMasjid <noreply@infomasjid.com>',
      to: [email],
      subject: `Peringatan: Masa Aktif InfoMasjid Sisa ${daysRemaining} Hari`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #e65100;">Peringatan Masa Aktif Layanan</h2>
          <p>Assalamu'alaikum Admin Masjid <strong>${masjidName || 'Anda'}</strong>,</p>
          <p>Ini adalah pemberitahuan otomatis bahwa masa aktif langganan InfoMasjid Anda tersisa <strong>${daysRemaining} hari lagi</strong>.</p>
          <p>Agar layanan layar TV tidak terhenti, mohon segera melakukan perpanjangan layanan melalui Dasbor Admin.</p>
          <div style="margin: 30px 0;">
            <a href="https://infomasjid.cloud/login" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Perpanjang Sekarang
            </a>
          </div>
          <p>Jika Anda memiliki pertanyaan, silakan hubungi tim dukungan kami.</p>
          <br />
          <p>Wassalamu'alaikum,</p>
          <p>Tim InfoMasjid</p>
        </div>
      `
    });
  } catch (error) {
    console.error("Failed to send reminder email:", error);
  }
};
