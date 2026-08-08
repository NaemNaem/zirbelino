import { NextResponse } from "next/server";
import { getProductRepository } from "@/repositories";

export async function GET() {
  const products = await getProductRepository().getAll();
  return NextResponse.json({ products });
}
