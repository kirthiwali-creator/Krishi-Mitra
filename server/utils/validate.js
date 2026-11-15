const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.str = (v) => (typeof v === 'string' ? v.trim() : '');
exports.isPhone = (v) => PHONE.test(v);
exports.isEmail = (v) => EMAIL.test(v);
