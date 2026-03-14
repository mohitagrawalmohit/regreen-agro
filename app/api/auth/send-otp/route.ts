import { NextResponse } from "next/server";

declare global {
  var otpStore: Record<string, { otp: string; expires: number }>;
}

global.otpStore = global.otpStore || {};

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json(
      { message: "Phone is required" },
      { status: 400 }
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

  global.otpStore[phone] = { otp, expires };

  // ✅ OTP ONLY IN TERMINAL
  console.log("========== DEV OTP ==========");
  console.log("Phone:", phone);
  console.log("OTP:", otp);
  console.log("Expires in 5 minutes");
  console.log("=============================");

  return NextResponse.json({
    success: true,
    message: "OTP generated (check terminal)",
  });
}
