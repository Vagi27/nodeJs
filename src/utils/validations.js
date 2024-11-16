const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;
    const options = { min: 3, max: 30 };

    if (!firstName || !lastName) {
        throw new Error("name is not valid");
    }

    if (
        !validator.isLength(firstName, options) ||
        !validator.isLength(lastName, options)
    ) {
        throw new Error(
            `Acceptable character range of firstName and lastName \nMin:${options.min} - Max:${options.max}`
        );
    }
    if (!validator.isEmail(email)) {
        throw new Error("Email is inValid");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }
};
const validateLoginData = (req) => {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
        throw new Error("credentials invalid");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("credentials invalid");
    }
};

const validateProfileEditData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "photoURL",
    ];

    const isValid = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );
    if (!isValid) {
        throw new Error("request is trying to edit Forbidden fields");
    }
    const { firstName, lastName, age, gender, about, skills, photoURL } =
        req.body;

    const nameOptions = { min: 3, max: 30 };
    if (
        (firstName &&
            !validator.isAlpha(firstName) ||
            !validator.isLength(firstName, nameOptions)) ||
        (lastName &&
            !validator.isAlpha(lastName) ||
            !validator.isLength(lastName, nameOptions))
    ) {
        throw new Error("name length invalid");
    }
    if (age && age < 18) {
        throw new Error("age not allowed below 18 years");
    }
    if (gender && !["male", "female", "others"].includes(gender)) {
        throw new Error("gender must be male, female, or others");
    }
    if (about && !validator.isLength(about, { min: 0, max: 150 })) {
        throw new Error("About must be under 150 characters");
    }
    if (skills && Array.isArray(skills) && skills.length > 10) {
        throw new Error("only 10 skills allowed");
    }
    if (photoURL && !validator.isURL(photoURL)) {
        throw new Error("photo URL is invalid!");
    }
};
module.exports = {
    validateSignUpData,
    validateLoginData,
    validateProfileEditData,
};
