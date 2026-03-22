import jwt from 'jsonwebtoken'
import userModal from '../models/userModal';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorization or token missing"
    })
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModal.findById(payload.id).select("-password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      })
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("JWT verification failed", error);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired"
    })
  }
}

export default authMiddleware;