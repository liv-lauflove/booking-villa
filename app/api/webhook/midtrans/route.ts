import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validasi Signature Key dari Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const signatureKey = crypto.createHash('sha512').update(data.order_id + data.status_code + data.gross_amount + serverKey).digest('hex');

    if (signatureKey !== data.signature_key && serverKey !== "SB-Mid-server-dummy") {
      return NextResponse.json({ message: "Invalid Signature Key" }, { status: 403 });
    }

    const { order_id, transaction_status, fraud_status } = data;
    const realOrderId = order_id.split('_')[0];

    let newStatus = "UNPAID";

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'challenge') {
        newStatus = "PENDING";
      } else if (fraud_status === 'accept' || !fraud_status) {
        newStatus = "PAID";
      }
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      newStatus = "UNPAID";
    } else if (transaction_status === 'pending') {
      newStatus = "PENDING";
    }

    // Update status di database
    if (newStatus === "PAID") {
      await prisma.payment.update({
        where: { reservationId: realOrderId },
        data: { status: "PAID" }
      });
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
