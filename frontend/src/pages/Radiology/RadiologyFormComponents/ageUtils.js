export const ageStringFromDob = (birthDate) => {
  if (!birthDate) return '';
  const today = new Date();
  const dob = new Date(birthDate);
  today.setHours(0, 0, 0, 0);
  dob.setHours(0, 0, 0, 0);

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    const prevMonthDays = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += prevMonthDays;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  if (years < 0) return '';
  return `${years} years ${months} months ${days} days`;
};

export const parseFlexibleAgeToDob = (input) => {
  if (!input) return null;
  const s = String(input).trim().toLowerCase();

  if (
    !isNaN(parseFloat(s)) &&
    !s.includes('month') &&
    !s.includes('day') &&
    !s.includes('year')
  ) {
    const val = Math.max(0, parseFloat(s));
    const years = Math.floor(val);
    const months = Math.round((val - years) * 12);
    const today = new Date();
    const dob = new Date(today);
    dob.setFullYear(today.getFullYear() - years);
    dob.setMonth(today.getMonth() - months);
    dob.setDate(today.getDate());
    dob.setHours(0, 0, 0, 0);
    return dob;
  }

  const parts = s.split(/\s+/);
  let years = 0,
    months = 0,
    days = 0;
  for (let i = 0; i < parts.length; i++) {
    const n = parseFloat(parts[i]);
    if (isNaN(n)) continue;
    const unit = (parts[i + 1] || '').toLowerCase();
    if (unit.startsWith('year')) years += n;
    else if (unit.startsWith('month')) months += n;
    else if (unit.startsWith('day')) days += n;
  }
  if (years === 0 && months === 0 && days === 0) {
    const n = parseFloat(s);
    if (!isNaN(n)) years = n;
  }

  years = Math.max(0, Math.floor(years));
  months = Math.max(0, Math.floor(months));
  days = Math.max(0, Math.floor(days));

  const today = new Date();
  const dob = new Date(today);
  dob.setFullYear(today.getFullYear() - years);
  dob.setMonth(today.getMonth() - months);
  dob.setDate(today.getDate() - days);
  dob.setHours(0, 0, 0, 0);
  return dob;
};