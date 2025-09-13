const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: [true, "Name is required"],
      minLength: [3, "Name must be at least 3 characters long"],
       maxLength: 50,
      trim: true,
     },
  dob: {
     type: Date, 
       required:[true, "Date of birth is required"]
   
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid Email: " + value);
    }
  },
  password: { 
    type: String, 
   required: [true, "Password is required"],
 minlength: [6, "Password must be at least 6 characters long"],

  }
},
{ 
    timestamps: true 
});

// Hashing password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Comparing password
userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating JWT
userSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1m' }); //'7d
  return token;
}

const User = mongoose.model("UserData", userSchema);
module.exports = User;
