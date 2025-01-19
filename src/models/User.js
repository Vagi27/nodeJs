const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            lowercase: true,
            maxLength: 30,
            required: true,
        },
        lastName: { type: String, lowercase: true, maxLength: 30 },
        email: { type: String, lowercase: true, unique: true, required: true },
        password: { type: String, required: true },
        age: { type: Number, min: 18 },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            },
        },
        about: { type: String, default: "This is DEFAULT About. " },
        skills: { type: [String] },
        photoURL: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        },
    },
    { timestamps: true }
);

const User = new mongoose.model("User", UserSchema);

module.exports = User;
