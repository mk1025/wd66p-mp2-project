// Contains atleast one digit combining with non-digit characters.
export const REGEX_CONTAINS_DIGITS: RegExp = /(?=.*[0-9])/;

// Contains atleast one lowercase combining with non-lowercase characters and digits
export const REGEX_CONTAINS_LOWERCASE: RegExp = /(?=.*[a-z])/;

// Contains atleast one uppercase combining with non-uppercase characters and digits
export const REGEX_CONTAINS_UPPERCASE: RegExp = /(?=.*[A-Z])/;

// Contains atleast one special combining with non-special characters and digits
export const REGEX_CONTAINS_SPECIAL: RegExp = /(?=.*[!@#$%^&*])/;

// Contains atleast one space combining with non-space characters
export const REGEX_CONTAINS_SPACE: RegExp = /\s/;

// Regular Expression for Emails
export const REGEX_EMAIL: RegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Regular Expression for Passwords
export const REGEX_PASSWORD: RegExp =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[^\\s].{7,65}$/;

// Regular Expression for Usernames
export const REGEX_USERNAME: RegExp = /^[a-zA-Z0-9]+$/;

// Regular Expression for Phone Numbers
export const REGEX_PHONE: RegExp =
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
