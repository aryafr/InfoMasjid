import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
