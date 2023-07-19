const mongoose = require("mongoose"); 
const { isEmail } = require("validator"); 
const bcrypt = require("bcrypt"); // Hashing password 

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"], 
    unique: true, //no user can signup with the same email twice
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"], //isEamil will check that email is valid or not
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});


// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); 
  next();
});

// Static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }); // this here refers to user. It will first check email exists or not
  if (user) {
    // comparing hashed password
    const auth = await bcrypt.compare(password, user.password); //if email exists so we will compare its hashed password with the one saved in database if it matches return to screen otherwise throw error
    if (auth) {
      return user; //Password matched
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

//model based on this schema
const User = mongoose.model("user", userSchema); 
module.exports = User;
