import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const salt = 10;

const encryptedPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, encryptedPassword) => {
      if (!!err) {
        reject(err);
        return;
      }
      resolve(encryptedPassword);
    });
  });
};

const checkPassword = (encryptedPassword: string, password: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(
            password,
            encryptedPassword,
            (err, isPasswordCorrect) => {
                if (!!err) {
                    reject(err);
                    return;
                }
                resolve(isPasswordCorrect);
            }
        );
    });
}

const createToken = (payload: string) => {
    const expiresIn = 60 * 60 * 1
    return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "cie kepo hmm", {
        expiresIn
    })
}

module.exports = {encryptedPassword, checkPassword, createToken}
