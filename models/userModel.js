import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    isVerified:{
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true
})

const User = mongoose.model('User', UserSchema);

export default User;