import { NextResponse } from "next/server";

declare global {
  var otpStore: Record<string, { otp: string; expires: number }>;
}

export async function POST(req: Request) {
  const { phone, otp } = await req.json();

  if (!phone || !otp) {
    return NextResponse.json(
      { message: "Phone and OTP required" },
      { status: 400 }
    );
  }

  const record = global.otpStore?.[phone];

  if (!record) {
    return NextResponse.json(
      { message: "OTP not found" },
      { status: 400 }
    );
  }

  if (Date.now() > record.expires) {
    delete global.otpStore[phone];
    return NextResponse.json(
      { message: "OTP expired" },
      { status: 400 }
    );
  }

  if (record.otp !== otp) {
    return NextResponse.json(
      { message: "Invalid OTP" },
      { status: 400 }
    );
  }

  delete global.otpStore[phone];

  return NextResponse.json({
    success: true,
    message: "OTP verified successfully",
  });
}

