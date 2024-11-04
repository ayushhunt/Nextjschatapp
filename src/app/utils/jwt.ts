import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export function createToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
