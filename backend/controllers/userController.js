import validator from 'validator'
import bcrypt from 'bcryptjs'
import userModal from '../models/userModal.js';
import jwt from 'jsonwebtoken'

const TOKEN_EXPIRES = '24h'
const createToken = (userId) => {
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES })

}
// register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All feilds are required'
    })
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Inavild email"
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      messsage: "Passwod must be atleast of 6 characters"
    })
  }

  try {
    if (await userModal.findOne({ email })) {
      return res.status(409).json({
        success: false,
        message: "User alredy present"
      })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await userModal.create({ name, email, password: hashed })
    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Both feild are required"
    })
  }

  try {
    const user = await userModal.findOne({ email });
    if (user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credential"
      })
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credential"
      })
    }

    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}


export { registerUser, loginUser }