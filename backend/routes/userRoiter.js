import express from 'express'
import { getCurrentUser, loginUser, registerUser, updatePassword, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import { useReducer } from 'react';

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("login", loginUser)

// protected route
userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.put("/password", authMiddleware, updatePassword);


export default userRouter;