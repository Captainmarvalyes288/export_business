// app/api/register/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, password, selectedBranch, selectedYear } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Get branch and financial year IDs
    const [branch, financialYear] = await Promise.all([
      prisma.branch.findFirst({
        where: { name: selectedBranch },
      }),
      prisma.financialYear.findFirst({
        where: { year: selectedYear },
      }),
    ]);

    if (!branch || !financialYear) {
      return NextResponse.json(
        { error: "Invalid branch or financial year" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); // Log the hashed password

    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        branchId: branch.id,
        financialYearId: financialYear.id,
        role: "USER",
        isVerified: false,
      },
    });
 
    console.log('User created successfully:', user);
  
    return NextResponse.json(
      { message: "Registration successful, waiting for admin verification" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
