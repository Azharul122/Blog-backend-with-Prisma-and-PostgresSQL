export const restictedMessageTemplete = (message: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; color: #333;">
  <h2 style="margin-bottom: 20px;">Content Moderation Alert</h2>

  <p style="font-size: 15px; line-height: 1.6;">
    Your post/comment cannot be approved because it contains restricted content
    related to:
    <strong>${message}</strong>.
  </p>

  <p style="font-size: 15px; line-height: 1.6;">
    Please edit the content and try again.
  </p>

  <div style="margin-top: 25px; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
    <strong>Detected Content Category:</strong>
    <span> ${message}</span>
  </div>
</div>
</body>
</html>
`;
};
