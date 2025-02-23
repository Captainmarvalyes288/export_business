
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, isVerified } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
