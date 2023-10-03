import mongoose from "mongoose";

const ArticleSchema = mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        unique: true 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: false 
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    // comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment'
    // }],
    // likes: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Like'
    // }],
    // dislikes: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Dislike'
    // }],
    // views: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'View'
    // }],
    // bookmarks: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Bookmark'
    // }],
},{
    timestamps: true
});

const Article = mongoose.model('Article', ArticleSchema);