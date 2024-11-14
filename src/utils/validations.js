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
const validateLoginData=(req)=>{

    const {email,password}=req.body;
    if(!validator.isEmail(email)){
        throw new Error("credentials invalid");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("credentials invalid");
    }

}
module.exports = { validateSignUpData,validateLoginData };
