import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

interface RefreshTokenPayload extends TokenPayload {
  tokenType: 'refresh';
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-for-dev';
const JWT_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const refreshPayload: RefreshTokenPayload = {
    ...payload,
    tokenType: 'refresh',
  };
  
  return jwt.sign(refreshPayload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const generateTokenPair = (payload: TokenPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
    if (decoded.tokenType !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};