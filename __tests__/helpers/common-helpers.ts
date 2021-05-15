export const generateRandomString = (length: number, charSet?: string): string => {
  const characterSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomPoz = Math.floor(Math.random() * characterSet.length);
    randomString += characterSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};
