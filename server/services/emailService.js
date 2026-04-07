import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendMatchNotification = async (toEmail, matchData) => {
  try {
    const transporter = createTransporter();
    const { teamName, opponentName, date, time, location } = matchData;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'HockeyHub <noreply@hockeyhub.com>',
      to: toEmail,
      subject: `🏒 Upcoming Match: ${teamName} vs ${opponentName}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #00d4ff, #0099cc); padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🏒 HockeyHub</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Match Notification</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #00d4ff; margin-top: 0;">${teamName} vs ${opponentName}</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: rgba(255,255,255,0.6); width: 100px;">📅 Date</td>
                <td style="padding: 12px 0; font-weight: 600;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: rgba(255,255,255,0.6);">⏰ Time</td>
                <td style="padding: 12px 0; font-weight: 600;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: rgba(255,255,255,0.6);">📍 Location</td>
                <td style="padding: 12px 0; font-weight: 600;">${location}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; color: rgba(255,255,255,0.6); font-size: 14px;">Good luck and play fair! 🏆</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: false, error: error.message };
  }
};
