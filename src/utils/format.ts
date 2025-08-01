import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const FormatUtils = {
  currency: (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  number: (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  },

  percentage: (value: number, decimals = 2): string => {
    return `${value.toFixed(decimals)}%`;
  },

  fileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  },

  phone: (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phoneNumber;
  },

  creditCard: (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    
    return match ? match.join(' ') : cardNumber;
  },

  maskCreditCard: (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 4) return cardNumber;
    
    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);
    
    return `${masked}${lastFour}`.match(/.{1,4}/g)?.join(' ') || cardNumber;
  },

  maskEmail: (email: string): string => {
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;
    
    const maskedUsername = username.length > 2 
      ? `${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}`
      : username;
      
    return `${maskedUsername}@${domain}`;
  },

  date: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isToday(dateObj)) {
      return 'Today';
    }
    
    if (isYesterday(dateObj)) {
      return 'Yesterday';
    }
    
    return format(dateObj, 'MMM dd, yyyy');
  },

  time: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'HH:mm');
  },

  dateTime: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  },

  relativeTime: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  },

  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  titleCase: (str: string): string => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  kebabCase: (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  camelCase: (str: string): string => {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (_, c) => c.toLowerCase());
  },

  truncate: (str: string, length: number, suffix = '...'): string => {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  },

  pluralize: (count: number, singular: string, plural?: string): string => {
    if (count === 1) return `${count} ${singular}`;
    return `${count} ${plural || singular + 's'}`;
  },
};