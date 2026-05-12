import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  inquiryType: string;
  company: string;
  department?: string;
  name: string;
  phone: string;
  fax?: string;
  email: string;
  emailConfirm: string;
  message?: string;
};

const requiredFields: Array<keyof ContactPayload> = [
  "inquiryType",
  "company",
  "name",
  "phone",
  "email",
  "emailConfirm",
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildContactEmailHtml(data: ContactPayload) {
  const rows: Array<[string, string]> = [
    ["問合せ項目", data.inquiryType],
    ["会社名・団体名", data.company],
    ["部署名", data.department || "—"],
    ["ご担当者名", data.name],
    ["TEL", data.phone],
    ["FAX", data.fax || "—"],
    ["メールアドレス", data.email],
  ];

  const rowHtml = rows
    .map(
      ([label, value], i) => `
        <tr>
          <th style="width:170px;padding:14px 18px;text-align:left;vertical-align:top;background:${i % 2 === 0 ? "#f6f4ed" : "#fbf9f3"};color:#1f3a2d;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;border-bottom:1px solid #e8e5db;font-family:'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,Arial,sans-serif;">
            ${escapeHtml(label)}
          </th>
          <td style="padding:14px 18px;vertical-align:top;color:#2a2a2a;font-size:15px;line-height:1.7;border-bottom:1px solid #e8e5db;background:${i % 2 === 0 ? "#ffffff" : "#fdfcf8"};font-family:'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,Arial,sans-serif;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `,
    )
    .join("");

  const message = (data.message || "").trim();
  const receivedAt = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>新しいお問い合わせ - 株式会社W・H</title>
</head>
<body style="margin:0;padding:0;background:#f3f1ea;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f1ea;font-family:'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,Arial,sans-serif;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e6e3d8;box-shadow:0 8px 30px -12px rgba(31,58,45,0.15);">

          <!-- Yamabuki sun-gold accent strip -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#e6b227 0%,#f0c84d 50%,#e6b227 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header: deep green editorial band -->
          <tr>
            <td style="padding:36px 36px 30px;background:linear-gradient(135deg,#1a3326 0%,#1f3a2d 50%,#2a5b3f 100%);color:#ffffff;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin:0 0 14px;font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#f0c84d;font-weight:600;">
                      W&middot;H Inquiry &nbsp;／&nbsp; No.10 Contact
                    </p>
                    <h1 style="margin:0;font-size:26px;line-height:1.4;font-weight:700;letter-spacing:0.02em;color:#ffffff;font-family:'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif;">
                      新しいお問い合わせを<br />受信しました
                    </h1>
                    <p style="margin:14px 0 0;font-size:12px;color:rgba(255,255,255,0.78);letter-spacing:0.06em;">
                      Received&nbsp;·&nbsp;${escapeHtml(receivedAt)}&nbsp;JST
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:28px 36px 8px;background:#ffffff;">
              <p style="margin:0;color:#4a4a4a;font-size:14px;line-height:1.9;">
                お問い合わせフォームから送信がありました。<br />
                以下の内容をご確認のうえ、2営業日以内にご返信ください。
              </p>
            </td>
          </tr>

          <!-- Section: お客様情報 -->
          <tr>
            <td style="padding:18px 36px 8px;background:#ffffff;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="border-left:3px solid #1f3a2d;padding:2px 0 2px 12px;">
                    <p style="margin:0;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#1f3a2d;font-weight:700;">
                      Customer Info
                    </p>
                    <p style="margin:4px 0 0;font-size:16px;color:#1a1a1a;font-weight:700;letter-spacing:0.04em;font-family:'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif;">
                      お客様情報
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:14px 36px 8px;background:#ffffff;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;border-top:1px solid #e8e5db;border-left:1px solid #e8e5db;border-right:1px solid #e8e5db;">
                ${rowHtml}
              </table>
            </td>
          </tr>

          <!-- Section: お問い合わせ内容 -->
          <tr>
            <td style="padding:24px 36px 8px;background:#ffffff;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="border-left:3px solid #e6b227;padding:2px 0 2px 12px;">
                    <p style="margin:0;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#1f3a2d;font-weight:700;">
                      Message
                    </p>
                    <p style="margin:4px 0 0;font-size:16px;color:#1a1a1a;font-weight:700;letter-spacing:0.04em;font-family:'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif;">
                      お問い合わせ内容
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:14px 36px 28px;background:#ffffff;">
              <div style="padding:22px 24px;background:#fbf9f3;border:1px solid #e8e5db;border-top:2px solid #e6b227;color:#2a2a2a;font-size:15px;line-height:2;white-space:pre-wrap;font-family:'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,Arial,sans-serif;">${escapeHtml(message || "（未入力）")}</div>
            </td>
          </tr>

          <!-- Action hint -->
          <tr>
            <td style="padding:0 36px 28px;background:#ffffff;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f6f4ed;border-left:3px solid #1f3a2d;">
                <tr>
                  <td style="padding:14px 18px;font-size:13px;line-height:1.8;color:#3a3a3a;">
                    <strong style="color:#1f3a2d;">返信先：</strong>
                    <a href="mailto:${escapeHtml(data.email)}" style="color:#1f3a2d;text-decoration:underline;">${escapeHtml(data.email)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 36px 28px;background:#1a3326;color:rgba(255,255,255,0.85);">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#f0c84d;font-weight:600;">
                      W&middot;H Co., Ltd.
                    </p>
                    <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;letter-spacing:0.04em;font-family:'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif;">
                      株式会社 W&middot;H
                    </p>
                    <p style="margin:10px 0 0;font-size:12px;line-height:1.8;color:rgba(255,255,255,0.7);">
                      TEL&nbsp;048-228-6770&nbsp;&nbsp;／&nbsp;&nbsp;Mon–Fri&nbsp;9:00–18:00
                    </p>
                    <p style="margin:14px 0 0;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.06em;">
                      このメールはお問い合わせフォームより自動送信されています。
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom accent strip -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#e6b227 0%,#f0c84d 50%,#e6b227 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildContactEmailText(data: ContactPayload) {
  return [
    "新しいお問い合わせを受信しました。",
    "",
    `問合せ項目: ${data.inquiryType}`,
    `会社名・団体名: ${data.company}`,
    `部署名: ${data.department || "-"}`,
    `ご担当者名: ${data.name}`,
    `TEL: ${data.phone}`,
    `FAX: ${data.fax || "-"}`,
    `メールアドレス: ${data.email}`,
    "",
    "お問い合わせ内容:",
    data.message?.trim() || "（未入力）",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as ContactPayload;

    for (const field of requiredFields) {
      if (!data[field] || !String(data[field]).trim()) {
        return NextResponse.json(
          { error: `必須項目が未入力です: ${field}` },
          { status: 400 },
        );
      }
    }

    if (data.email !== data.emailConfirm) {
      return NextResponse.json(
        { error: "メールアドレスと確認用メールアドレスが一致しません。" },
        { status: 400 },
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactTo = process.env.CONTACT_EMAIL_TO;

    if (!smtpHost || !smtpUser || !smtpPass || !contactTo) {
      return NextResponse.json(
        { error: "メール送信の設定が不完全です。環境変数を確認してください。" },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"W・H Website" <${smtpUser}>`,
      to: contactTo,
      replyTo: data.email,
      subject: `【お問い合わせ】${data.inquiryType} / ${data.company}`,
      text: buildContactEmailText(data),
      html: buildContactEmailHtml(data),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact mail send failed:", error);
    return NextResponse.json(
      { error: "送信に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 },
    );
  }
}
