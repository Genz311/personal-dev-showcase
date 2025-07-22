import { hashPassword, comparePassword } from './password';

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('should hash a valid password', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);
      
      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(password); // Should not be plain text
      expect(hashed.length).toBeGreaterThan(50); // bcrypt hashes are long
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2); // Due to salting
    });

    it('should throw error for short password', async () => {
      await expect(hashPassword('12345')).rejects.toThrow(
        'Password must be at least 6 characters long'
      );
    });

    it('should throw error for empty password', async () => {
      await expect(hashPassword('')).rejects.toThrow(
        'Password must be at least 6 characters long'
      );
    });
  });

  describe('comparePassword', () => {
    const password = 'testPassword123';
    let hashedPassword: string;

    beforeAll(async () => {
      hashedPassword = await hashPassword(password);
    });

    it('should return true for correct password', async () => {
      const result = await comparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const result = await comparePassword('wrongPassword', hashedPassword);
      expect(result).toBe(false);
    });

    it('should return false for empty password', async () => {
      const result = await comparePassword('', hashedPassword);
      expect(result).toBe(false);
    });

    it('should handle case-sensitive passwords', async () => {
      const result = await comparePassword('TESTPASSWORD123', hashedPassword);
      expect(result).toBe(false);
    });
  });

  describe('Password security', () => {
    it('should handle special characters in passwords', async () => {
      const specialPassword = 'Test@#$%^&*()_+{}[]|:;<>,.?/~`123';
      const hashed = await hashPassword(specialPassword);
      const result = await comparePassword(specialPassword, hashed);
      
      expect(result).toBe(true);
    });

    it('should handle unicode characters in passwords', async () => {
      const unicodePassword = 'Test123🔐🚀你好';
      const hashed = await hashPassword(unicodePassword);
      const result = await comparePassword(unicodePassword, hashed);
      
      expect(result).toBe(true);
    });

    it('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(100) + 'Test123';
      const hashed = await hashPassword(longPassword);
      const result = await comparePassword(longPassword, hashed);
      
      expect(result).toBe(true);
    });
  });
});