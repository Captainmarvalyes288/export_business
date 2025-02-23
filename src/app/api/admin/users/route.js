import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    // Verify admin token
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
   
    if (!decoded || decoded.role !== "ADMIN") { 
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get all users (both verified and unverified)
    const users = await prisma.user.findMany({
      where: {
        role: "USER", // Changed from "user" to "USER"
      },
      include: {
        branch: true,
        financialYear: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    // Verify admin token
    const token = req.headers.get("authorization")?.split(" ")[1];
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
    console.error("Error in PATCH /api/admin/users:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}