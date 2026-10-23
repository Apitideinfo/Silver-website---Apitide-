/**
 * Formatting utilities
 */

/** Format currency value in INR locale styling */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹ 0';
  return `₹ ${Math.round(amount).toLocaleString('en-IN')}`;
}

/** Format weight to fixed precision */
export function formatWeight(grams) {
  const num = parseFloat(grams);
  if (isNaN(num)) return '0g';
  return `${num.toFixed(3)}g`;
}

/** Format date string for localized standard display */
export function formatDisplayDate(dateVal) {
  if (!dateVal) return '';
  try {
    let date;
    if (typeof dateVal?.toDate === 'function') date = dateVal.toDate();
    else if (dateVal?.seconds) date = new Date(dateVal.seconds * 1000);
    else date = new Date(dateVal);
    
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

/** Safely format date with fallback for Firestore timestamps */
export function formatDateSafe(dateVal, options = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) {
  try {
    if (!dateVal) return new Date().toLocaleString('en-IN', options);
    let d;
    if (typeof dateVal?.toDate === 'function') d = dateVal.toDate();
    else if (dateVal?.seconds) d = new Date(dateVal.seconds * 1000);
    else d = new Date(dateVal);

    if (isNaN(d.getTime())) return new Date().toLocaleString('en-IN', options);
    return d.toLocaleString('en-IN', options);
  } catch {
    return new Date().toLocaleString('en-IN', options);
  }
}
