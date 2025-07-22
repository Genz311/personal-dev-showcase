export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  // Username must be 3-30 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

export const isValidPassword = (password: string): boolean => {
  // Password must be at least 6 characters
  return Boolean(password && password.length >= 6);
};

export interface ValidationError {
  field: string;
  message: string;
}

export const validateRegistrationData = (data: {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Please provide a valid email address',
    });
  }

  if (!data.username || !isValidUsername(data.username)) {
    errors.push({
      field: 'username',
      message: 'Username must be 3-30 characters, alphanumeric and underscores only',
    });
  }

  if (!data.password || !isValidPassword(data.password)) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters long',
    });
  }

  if (data.displayName && data.displayName.trim().length === 0) {
    errors.push({
      field: 'displayName',
      message: 'Display name cannot be empty',
    });
  }

  return errors;
};

export const validateLoginData = (data: {
  emailOrUsername: string;
  password: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.emailOrUsername || data.emailOrUsername.trim().length === 0) {
    errors.push({
      field: 'emailOrUsername',
      message: 'Email or username is required',
    });
  }

  if (!data.password || data.password.length === 0) {
    errors.push({
      field: 'password',
      message: 'Password is required',
    });
  }

  return errors;
};