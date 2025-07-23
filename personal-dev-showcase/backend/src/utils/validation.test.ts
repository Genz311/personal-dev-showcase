import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  validateRegistrationData,
  validateLoginData,
} from './validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
      expect(isValidEmail('user_123@sub.example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('should validate correct usernames', () => {
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('test_user')).toBe(true);
      expect(isValidUsername('User_123')).toBe(true);
      expect(isValidUsername('abc')).toBe(true); // 3 chars min
    });

    it('should reject invalid usernames', () => {
      expect(isValidUsername('ab')).toBe(false); // Too short
      expect(isValidUsername('a'.repeat(31))).toBe(false); // Too long
      expect(isValidUsername('user-name')).toBe(false); // Hyphen not allowed
      expect(isValidUsername('user name')).toBe(false); // Space not allowed
      expect(isValidUsername('user@123')).toBe(false); // Special char
      expect(isValidUsername('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate correct passwords', () => {
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('Test@123')).toBe(true);
      expect(isValidPassword('a'.repeat(100))).toBe(true); // Long password
    });

    it('should reject invalid passwords', () => {
      expect(isValidPassword('12345')).toBe(false); // Too short
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword(null as any)).toBe(false);
    });
  });

  describe('validateRegistrationData', () => {
    it('should pass valid registration data', () => {
      const data = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        name: 'Test User',
      };

      const errors = validateRegistrationData(data);
      expect(errors).toHaveLength(0);
    });

    it('should validate without optional name', () => {
      const data = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const errors = validateRegistrationData(data);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid email', () => {
      const data = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'password123',
      };

      const errors = validateRegistrationData(data);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('email');
    });

    it('should return errors for invalid username', () => {
      const data = {
        email: 'test@example.com',
        username: 'a',
        password: 'password123',
      };

      const errors = validateRegistrationData(data);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('username');
    });

    it('should return errors for invalid password', () => {
      const data = {
        email: 'test@example.com',
        username: 'testuser',
        password: '123',
      };

      const errors = validateRegistrationData(data);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('password');
    });

    it('should return multiple errors', () => {
      const data = {
        email: '',
        username: '',
        password: '',
      };

      const errors = validateRegistrationData(data);
      expect(errors).toHaveLength(3);
      expect(errors.map(e => e.field)).toEqual(['email', 'username', 'password']);
    });

    it('should reject empty name', () => {
      const data = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        name: '   ',
      };

      const errors = validateRegistrationData(data);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('name');
    });
  });

  describe('validateLoginData', () => {
    it('should pass valid login data with email', () => {
      const data = {
        emailOrUsername: 'test@example.com',
        password: 'password123',
      };

      const errors = validateLoginData(data);
      expect(errors).toHaveLength(0);
    });

    it('should pass valid login data with username', () => {
      const data = {
        emailOrUsername: 'testuser',
        password: 'password123',
      };

      const errors = validateLoginData(data);
      expect(errors).toHaveLength(0);
    });

    it('should return error for missing emailOrUsername', () => {
      const data = {
        emailOrUsername: '',
        password: 'password123',
      };

      const errors = validateLoginData(data);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('emailOrUsername');
    });

    it('should return error for missing password', () => {
      const data = {
        emailOrUsername: 'test@example.com',
        password: '',
      };

      const errors = validateLoginData(data);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('password');
    });

    it('should return multiple errors', () => {
      const data = {
        emailOrUsername: '',
        password: '',
      };

      const errors = validateLoginData(data);
      expect(errors).toHaveLength(2);
      expect(errors.map(e => e.field)).toEqual(['emailOrUsername', 'password']);
    });
  });
});