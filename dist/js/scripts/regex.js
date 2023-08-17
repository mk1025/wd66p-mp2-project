export const REGEX_CONTAINS_DIGITS = /(?=.*[0-9])/;
export const REGEX_CONTAINS_LOWERCASE = /(?=.*[a-z])/;
export const REGEX_CONTAINS_UPPERCASE = /(?=.*[A-Z])/;
export const REGEX_CONTAINS_SPECIAL = /(?=.*[!@#$%^&*])/;
export const REGEX_CONTAINS_SPACE = /\s/;
export const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const REGEX_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[^\\s].{7,65}$/;
export const REGEX_USERNAME = /^(?=[a-zA-Z_])[a-zA-Z0-9_]{7,20}$/;
export const REGEX_PHONE = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
