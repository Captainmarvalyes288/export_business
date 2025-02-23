
// lib/auth.js
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
}

export async function authenticateRequest(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

export function withAuth(handler) {
  return async (req) => {
    const user = await authenticateRequest(req);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(req, user);
  };
}

export function withAdminAuth(handler) {
  return async (req) => {
    const user = await authenticateRequest(req);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(req, user);
  };
}