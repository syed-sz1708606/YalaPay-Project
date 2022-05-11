// Add mongoose model stuff here
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First Name required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name required"],
  },
  email: {
    type: String,
    required: [true, "Email required"],
  },
  password: {
    type: String,
    required: [true, "password required"],
  },
});

export default mongoose.model("User", userSchema);
