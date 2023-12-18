function generateRandomId(prefix) {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 100 * timestamp);
  return `${prefix}${random}`;
}

export { generateRandomId };
