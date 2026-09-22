/** RSF-240922-4816 — short enough to read out over the phone. */
export const makeOrderId = (now = new Date()) => {
  const stamp = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RSF-${stamp}-${random}`;
};
