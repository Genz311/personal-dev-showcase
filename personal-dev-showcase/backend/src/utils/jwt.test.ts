import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
} from './jwt';

describe('JWT Utils', () => {
  const mockPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
  };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(mockPayload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken(mockPayload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format
    });
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', () => {
      const tokens = generateTokenPair(mockPayload);
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = generateAccessToken(mockPayload);
      const decoded = verifyAccessToken(token);
      
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.username).toBe(mockPayload.username);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyAccessToken('invalid-token')).toThrow(
        'Invalid or expired access token'
      );
    });

    it('should throw error for refresh token used as access token', () => {
      const refreshToken = generateRefreshToken(mockPayload);
      expect(() => verifyAccessToken(refreshToken)).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = verifyRefreshToken(token);
      
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.username).toBe(mockPayload.username);
      expect(decoded.tokenType).toBe('refresh');
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyRefreshToken('invalid-token')).toThrow(
        'Invalid or expired refresh token'
      );
    });

    it('should throw error for access token used as refresh token', () => {
      const accessToken = generateAccessToken(mockPayload);
      expect(() => verifyRefreshToken(accessToken)).toThrow(
        'Invalid or expired refresh token'
      );
    });
  });

  describe('Token expiration', () => {
    beforeAll(() => {
      // Mock timers for testing expiration
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should handle expired access token', () => {
      const token = generateAccessToken(mockPayload);
      
      // Verify token is valid initially
      expect(() => verifyAccessToken(token)).not.toThrow();
      
      // Fast forward time beyond token expiration (15 minutes + 1 second)
      jest.advanceTimersByTime(15 * 60 * 1000 + 1000);
      
      // Token should now be expired
      expect(() => verifyAccessToken(token)).toThrow(
        'Invalid or expired access token'
      );
    });

    it('should handle expired refresh token', () => {
      const token = generateRefreshToken(mockPayload);
      
      // Verify token is valid initially
      expect(() => verifyRefreshToken(token)).not.toThrow();
      
      // Fast forward time beyond token expiration (7 days + 1 second)
      jest.advanceTimersByTime(7 * 24 * 60 * 60 * 1000 + 1000);
      
      // Token should now be expired
      expect(() => verifyRefreshToken(token)).toThrow(
        'Invalid or expired refresh token'
      );
    });
  });
});