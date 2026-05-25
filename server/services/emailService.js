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

// ─── Contact Form Email ─────────────────────────────────────────
// Sends the visitor's message to the site owner AND a confirmation back to the visitor
export const sendContactMessage = async ({ name, email, message }) => {
  try {
    const transporter = createTransporter();
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER;

    if (!receiverEmail) {
      throw new Error('No receiver email configured (set CONTACT_RECEIVER_EMAIL)');
    }

    // 1) Send the message TO YOU (the site owner)
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'HockeyHub <noreply@hockeyhub.com>',
      to: receiverEmail,
      replyTo: email, // So you can hit "Reply" and it goes to the visitor
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #00d4ff, #0099cc); padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🏒 HockeyHub</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">New Contact Form Submission</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: rgba(255,255,255,0.6); width: 100px; vertical-align: top;">👤 Name</td>
                <td style="padding: 12px 0; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: rgba(255,255,255,0.6); vertical-align: top;">📧 Email</td>
                <td style="padding: 12px 0; font-weight: 600;">
                  <a href="mailto:${email}" style="color: #00d4ff; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: rgba(255,255,255,0.6); vertical-align: top;">💬 Message</td>
                <td style="padding: 12px 0; font-weight: 400; line-height: 1.6; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 16px; background: rgba(0,212,255,0.1); border-left: 3px solid #00d4ff; border-radius: 4px;">
              <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 13px;">
                💡 You can reply directly to this email — it will go to <strong>${email}</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // 2) Send a confirmation email BACK TO the visitor
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'HockeyHub <noreply@hockeyhub.com>',
      to: email,
      subject: `✅ We received your message, ${name}!`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #00d4ff, #0099cc); padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🏒 HockeyHub</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Message Received</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #00d4ff; margin-top: 0;">Hi ${name}! 👋</h2>
            <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
              Thank you for reaching out to HockeyHub! We've received your message and will get back to you as soon as possible.
            </p>
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Message</p>
              <p style="margin: 0; color: rgba(255,255,255,0.8); white-space: pre-wrap; line-height: 1.5;">${message}</p>
            </div>
            <p style="margin-top: 24px; color: rgba(255,255,255,0.6); font-size: 14px;">
              — The HockeyHub Team 🏆
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Contact email error:', error.message);
    return { success: false, error: error.message };
  }
};

