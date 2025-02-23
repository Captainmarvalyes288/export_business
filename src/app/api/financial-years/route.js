
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function GET() {
  try {
    const financialYears = await prisma.financialYear.findMany();
    return NextResponse.json(financialYears);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch financial years" }, { status: 500 });
  }
}
