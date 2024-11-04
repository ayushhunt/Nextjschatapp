import { NextResponse } from 'next/server';
import { createToken } from './jwt';

export function setTokenCookie(response: NextResponse, token: string) {
  response.cookies.set('token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export function removeTokenCookie(response: NextResponse) {
  response.cookies.delete('token');
}
