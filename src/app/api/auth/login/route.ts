import { createToken } from '@/app/utils/jwt';
import bcrypt from 'bcryptjs';
import User from '@/app/models/User';
import { connectToDatabase } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { setTokenCookie } from '@/app/utils/auth';


export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  await connectToDatabase();
  
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }

  const token = createToken(user._id.toString());
  const response = NextResponse.json({ message: 'Login successful' });
  
  setTokenCookie(response, token);
  return response;
}
