import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// @desc    Register a new user
// @route   POST /api/users

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            error: "Please enter all fields",
        });
    }

    const ifUserAlreadyExists = await User.findOne({ $or: [{ email }, { username }] });

    if (ifUserAlreadyExists) {
        return res.status(400).json({
            success: false,
            error: ifUserAlreadyExists.email === email ? "Email already exists" : "Username already exists",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

        res.json({
            success: true,
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            },
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// @desc    Login user
// @route   POST /api/users/login

export const login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({
            success: false,
            error: "Please enter both identifier and password",
        });
    }

    try {
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User does not exist",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
            },
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

