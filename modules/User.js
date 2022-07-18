import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    passwordHach: {
        type: String,
        required: true
    },
    avatar: String,
    },
    {
        timestamps: true
    }
)

export default mongoose.model('User', UserSchema)