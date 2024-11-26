import jwt from "jsonwebtoken";

const accessTokenSecret = "yourAccessTokenSecret"; // Replace with a secret key
const refreshTokenSecret = "yourRefreshTokenSecret"; // Replace with a secret key
const accessTokenExpiration = "15m"; // 15 minutes or any desired time
const refreshTokenExpiration = "7d"; // 7 days or more

interface Account {
  _id: string;
  roleID: string;
}

export const generateAccessToken = (account: Account): string => {
  return jwt.sign(
    { id: account._id, role: account.roleID },
    accessTokenSecret,
    {
      expiresIn: accessTokenExpiration,
    }
  );
};

export const generateRefreshToken = (account: Account): string => {
  return jwt.sign({ id: account._id }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiration,
  });
};

export const verifyToken = (token: string, secret: string): any => {
  return jwt.verify(token, secret);
};
