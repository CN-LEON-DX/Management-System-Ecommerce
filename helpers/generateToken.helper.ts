// Function to generate a random key of a given length
export const genRandomKey = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Function to generate a random OTP (One Time Password) of a given length
export const genOTP = (length: number): string => {
  const figures = "0123456789";
  let result = "";
  const charactersLength = figures.length;
  for (let i = 0; i < length; i++) {
    result += figures.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

