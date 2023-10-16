function generateRandomId(prefix) {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000 * timestamp);
  return `${prefix}-${random}`;
}

export { generateRandomId };
