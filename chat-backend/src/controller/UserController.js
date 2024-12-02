import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { mobileNumber }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or mobile number'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new users
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      mobileNumber
    });

    await user.save();

    res.status(201).json({
      status: 201,
      message: 'User registered successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: [error?.message]
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).send({
      status: 200,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
          username: user.username
        }
      },
      message: 'Login successful'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: [error?.message]
    });
  }
};


export const searchUser = async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const users = await User.find({
      $and: [
        {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { username: { $regex: searchQuery, $options: 'i' } }
          ]
        },
        { _id: { $ne: req.user._id } } // Exclude the logged in user
      ]
    }, {name: 1, username: 1});
    res.status(200).json({
      status: 200,
      data: users,
      message: 'Users fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: [error?.message]
    });
  }
}
