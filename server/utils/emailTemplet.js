// utils/emailTemplate.js

const generateEmailTemplate = (title, message, otp) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center;">${title}</h2>
          <p style="font-size: 16px; color: #555;">${message}</p>
          <div style="text-align: center; margin: 20px 20px;">
            <span style="display: inline-block; font-size: 28px; letter-spacing: 5px; font-weight: bold; background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #999; text-align: center;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `;
};

export default generateEmailTemplate;
