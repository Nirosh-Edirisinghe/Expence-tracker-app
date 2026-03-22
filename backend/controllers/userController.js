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

// get user funcion
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModal.findById(userId).select("name email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    res.json({ success: true, user })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    })
  }
}

// update user profile
const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "valid email and name are required"
    });
  }

  try {
    const exists = await userModal.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already in use"
      })
    }

    const user = await userModal.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "name, email" }
    )

    res.json({
      success: true,
      user,
      message: "user update success"
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    })
  }
}

// chnage password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.lenght < 6) {
    return res.status(400).json({
      success: false,
      message: "Password invalid or too short"
    })
  }

  try {
    const user = await userModal.findById(req.user.id).select("password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not found"
      })
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Current password is in correct"
      })
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({
      success: true,
      message: "Password changed"
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    })
  }
}


export { registerUser, loginUser, getCurrentUser, updateProfile, updatePassword }