import mongoose from "mongoose";

const RoleSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
},{
    timestamps: true
});

const Role = mongoose.model('Role', RoleSchema);

export default Role;