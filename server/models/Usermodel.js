import mongoose from 'mongoose';
import { genSalt, hash } from 'bcrypt';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    image: {
        path: String,
        filename: String,
    },
    color: {
        type: Number,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
});

// Pre-save hook to hash the password before saving the user document
UserSchema.pre('save', async function (next) {  //"this." doesn't work within the arrow function show using anonyumus callback function"
    if (this.isModified('password')) {
        const salt = await genSalt();
        this.password = await hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', UserSchema);
export default User;