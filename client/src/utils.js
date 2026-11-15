export const CATEGORIES = ['grain', 'vegetable', 'fruit', 'pulse', 'spice', 'oilseed', 'other'];
export const STATUSES = ['pending', 'accepted', 'rejected', 'shipped', 'delivered', 'cancelled'];

export const CATEGORY_ICON = {
  grain: '🌾',
  vegetable: '🥬',
  fruit: '🍎',
  pulse: '🫘',
  spice: '🌶️',
  oilseed: '🥜',
  other: '🌱'
};

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const dashboardPath = (role) => (role === 'farmer' ? '/farmer' : '/buyer');
