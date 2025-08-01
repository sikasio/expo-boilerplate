export const ValidationUtils = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  numeric: (value: string): boolean => {
    return !isNaN(Number(value));
  },

  alphabetic: (value: string): boolean => {
    const alphabeticRegex = /^[a-zA-Z\s]+$/;
    return alphabeticRegex.test(value);
  },

  alphanumeric: (value: string): boolean => {
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    return alphanumericRegex.test(value);
  },

  creditCard: (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s|-/g, '');
    const cardRegex = /^\d{13,19}$/;
    
    if (!cardRegex.test(cleaned)) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  },

  expiryDate: (expiry: string): boolean => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) {
      return false;
    }

    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expiryYear = parseInt(year);
    const expiryMonth = parseInt(month);

    if (expiryYear < currentYear) {
      return false;
    }

    if (expiryYear === currentYear && expiryMonth < currentMonth) {
      return false;
    }

    return true;
  },

  cvv: (cvv: string): boolean => {
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(cvv);
  },
};