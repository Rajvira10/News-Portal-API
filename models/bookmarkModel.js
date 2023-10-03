import mongoose from "mongoose";

const BookmarkSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
},{
    timestamps: true
});

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);

export default Bookmark;