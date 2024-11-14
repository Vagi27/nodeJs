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
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw2ggkxKcRisToE8223z0WGe&ust=1731683774257000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjB4_OO3IkDFQAAAAAdAAAAABAJ",
        },
    },
    { timestamps: true }
);

const User = new mongoose.model("User", UserSchema);

module.exports = User;
