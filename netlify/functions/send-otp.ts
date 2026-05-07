import type { Handler } from "@netlify/functions";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

const client = twilio(accountSid, authToken);

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { phone } = JSON.parse(event.body || "{}");
    if (!phone || typeof phone !== "string") {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Phone number required" }) };
    }

    const digits = phone.replace(/\D/g, "");
    let e164: string;
    if (digits.length === 10) e164 = `+1${digits}`;
    else if (digits.length === 11 && digits.startsWith("1")) e164 = `+${digits}`;
    else return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid US phone number" }) };

    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: e164, channel: "sms" });

    const ipAddress =
      event.headers["x-nf-client-connection-ip"] ||
      event.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      "";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: verification.status, ipAddress }),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("send-otp error:", message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to send verification code" }) };
  }
};
