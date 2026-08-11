export const getOtpEmailTemplate = (
  otp: string,
  expiryMinutes: number = 5,
  title: string = "Your OTP Code",
  description: string = "Your OTP code is",
) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#4f46e5; padding: 32px 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:600;">${title}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin:0 0 8px; color:#1f2937; font-size:15px;">Hi,</p>
              <p style="margin:0 0 28px; color:#4b5563; font-size:15px; line-height:1.6;">
                Use the verification code below to complete your action. This code is valid for <strong>${expiryMinutes} minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background-color:#f4f4f7; border: 1px dashed #c7c9d9; border-radius:10px; padding: 24px; text-align:center; margin-bottom: 24px;">
                <span style="font-size:34px; font-weight:700; letter-spacing:8px; color:#4f46e5;">${otp}</span>
              </div>

              <!-- Expiry note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background-color:#fff7ed; border-radius:8px; padding: 12px 16px;">
                    <p style="margin:0; color:#9a3412; font-size:13px;">
                      ⏱️ This code expires in <strong>${expiryMinutes} minutes</strong>. Do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0; color:#6b7280; font-size:13px; line-height:1.6;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color:#fafafa; text-align:center; border-top:1px solid #eeeeee;">
              <p style="margin:0; color:#9ca3af; font-size:12px;">
                © ${new Date().getFullYear()} YourApp. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export default getOtpEmailTemplate;
