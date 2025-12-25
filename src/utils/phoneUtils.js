/**
 * Normaliza números de teléfono mexicanos para búsqueda en Stripe
 * @param {string} phone - Número de teléfono en cualquier formato
 * @returns {string} - Número normalizado en formato +52 1 XXXXXXXXXX
 */
function normalizePhoneNumber(phone) {
  if (!phone) return '';
  
  // Elimina todo excepto números
  let digits = phone.replace(/\D/g, '');
  
  // Si empieza con 521 y tiene 13 dígitos, ya está bien
  if (digits.startsWith('521') && digits.length === 13) {
    return '+' + digits;
  }
  
  // Si empieza con 52 y tiene 12 dígitos (le falta el 1)
  if (digits.startsWith('52') && digits.length === 12) {
    // Agrega el 1 después del 52
    return '+52 1 ' + digits.substring(2);
  }
  
  // Si tiene 10 dígitos (número local sin código de país)
  if (digits.length === 10) {
    return '+52 1 ' + digits;
  }
  
  // Si empieza con 1 y tiene 11 dígitos (falta el +52)
  if (digits.startsWith('1') && digits.length === 11) {
    return '+52 ' + digits;
  }
  
  // Retorna con + al inicio si no lo tiene
  return digits.startsWith('+') ? phone : '+' + digits;
}

/**
 * Normaliza para comparación (sin espacios ni guiones)
 * @param {string} phone 
 * @returns {string}
 */
function normalizeForComparison(phone) {
  const normalized = normalizePhoneNumber(phone);
  return normalized.replace(/[\s-]/g, ''); // Elimina espacios y guiones
}

module.exports = {
  normalizePhoneNumber,
  normalizeForComparison
};
