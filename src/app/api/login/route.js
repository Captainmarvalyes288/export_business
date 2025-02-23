import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    
    // Find user in database with relations
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        branch: true,
        financialYear: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Check if user is verified (skip check for admin)
    if (user.role !== "ADMIN" && !user.isVerified) {
      return NextResponse.json(
        { error: "Account pending verification" },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        branchId: user.branchId,
        financialYearId: user.financialYearId,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" } 
    );

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        branch: user.branch?.name,
        financialYear: user.financialYear?.year,
        isVerified: user.isVerified
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}