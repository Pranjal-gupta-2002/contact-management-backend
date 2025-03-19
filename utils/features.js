import jwt from "jsonwebtoken";

export const generateToken = (user, code, res, message) => {
  const token = jwt.sign({ id: user._id },"p", {
    expiresIn: "30d",
  });
  return res.status(code).cookie("token",token).json({
    success: true,
    message,
    token,
    user,
  });
};
