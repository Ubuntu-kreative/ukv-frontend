import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("M-PESA CALLBACK:", JSON.stringify(body, null, 2));

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted"
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: "Error"
      },
      {
        status: 500
      }
    );
  }
}