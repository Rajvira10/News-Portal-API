import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: { 
        type: String, 
        required: true 
    },
    article:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
},
{
    timestamps: true
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;