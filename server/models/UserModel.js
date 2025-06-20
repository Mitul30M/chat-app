import mongoose from "mongoose";
import { hash, compare } from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required."],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required."],
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    profileImg: {
        url: String,
        fileName: String
        // required: true
    },
    //if profileSetup : false then the user hasn't completed his account setup so he cant access the chat app till he completes the setup
    profileSetup: {
        type: Boolean,
        default: false,
    },
    oauthProvider: {
        type: String,
        // This field stores the OAuth provider (e.g., 'google', 'github')
        required: false,
    },
    oauthId: {
        type: String,
        // This field stores the OAuth provider's user ID
        required: false,
    },

}, { timestamps: true, toJSON: { virtuals: true } })

userSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function (next) {
    //this.isModified('field') : returns true if the value of the specified field had been updated atleast once
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
})

//define a method which works on the whole model instead of instances of the model (like methods defined under userSchema.methods.function)
userSchema.statics.findUserAndValidate = async function (email, password) {
    const foundUser = await this.findOne({ email });
    const isValid = await compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

userSchema.post('deleteOne', async function (doc) {
    if (doc) {
        await cloudinary.uploader.destroy(doc.profileImg.fileName);
    }
})

const User = mongoose.model("Users", userSchema);
export default User;