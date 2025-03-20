import jwt from "jsonwebtoken";

export const generateToken = (user, code, res, message) => {
  const options = {
    expires:new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,  // Ensure your server is running over HTTPS
    sameSite: 'None',  // Required for cross-origin cookies
}
  const token = jwt.sign({ id: user._id },"p", {
    expiresIn: "30d",
  });
  return res.status(code).cookie("token",token,options).json({
    success: true,
    message,
    token,
    user,
  });
};
