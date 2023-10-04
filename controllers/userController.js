import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../helpers/nodemailer.js';
import generateOTP from '../helpers/generateOTP.js';

import User from '../models/userModel.js';
import OTP from '../models/otpModel.js';

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
        const ifVerified = ifUserAlreadyExists.ifVerified ? true : false;

        if (ifVerified) {
            return res.status(400).json({
                success: false,
                error: ifUserAlreadyExists.email === email ? "Email already exists" : "Username already exists",
            });
        }
        else{
            return res.status(400).json({
                success: false,
                error: "Please verify your email",
            });
        }
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
        const otp = generateOTP();

        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

        const newOTP = new OTP({
            otp,
            otpExpiration,
            email: savedUser.email,
        });

        await newOTP.save();

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: savedUser.email,
            subject: "Email Verification",
            html: `<h1>OTP: ${otp}</h1>`,
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        }
        );

        res.json({
            success: true,
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


// @desc    Resend OTP
// @route   POST /api/users/resend-otp

export const resendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            error: "Please enter email",
        });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User does not exist",
            });
        }

        const oldOtps = await OTP.find({ email: email });

        if (oldOtps) {
            OTP.deleteMany(oldOtps);
        }

        const otp = generateOTP();

        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

        const newOTP = new OTP({
            otp,
            otpExpiration,
            email: user.email,
        });

        await newOTP.save();

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: user.email,
            subject: "Email Verification",
            html: `<h1>OTP: ${otp}</h1>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        }
        );

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
}


// @desc    Verify OTP
// @route   POST /api/users/verify-otp

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!otp) {
        return res.status(400).json({
            success: false,
            error: "Please enter OTP",
        });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User does not exist",
            });
        }

        const findOTP = await OTP.findOne({ otp: otp, email: email });

        if (!findOTP) {
            return res.status(400).json({
                success: false,
                error: "OTP is incorrect",
            });
        }

        const isOTPExpired = new Date() > findOTP.otpExpiration;

        if (isOTPExpired) {
            return res.status(400).json({
                success: false,
                error: "OTP is expired",
            });
        }

        await OTP.deleteOne({ otp: otp, email: email });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        user.isVerified = true;

        await user.save();

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
}