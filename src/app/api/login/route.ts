import { NextResponse } from 'next/server';
import { handleInputFormSubmission } from '../../../controllers/login';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await handleInputFormSubmission(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in route.ts:", err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
  
}