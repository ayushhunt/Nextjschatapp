import bcrypt from 'bcryptjs';
import User from '@/app/models/User';
import { connectToDatabase } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { createToken,verifyToken } from '@/app/utils/jwt';
import { setTokenCookie } from '@/app/utils/auth';

export async function POST(request: Request) {
  const { username, email, password } = await request.json();
  
  await connectToDatabase();
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hashedPassword });
  
  const token = createToken(newUser._id.toString());
  const response = NextResponse.json({ message: 'User registered successfully' });
  
  setTokenCookie(response, token);
  return response;
}
