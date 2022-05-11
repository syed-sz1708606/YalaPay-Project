// Add mongoose model stuff here
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bankSchema = new Schema({
    name: {
        type: String,
        required: [true, "Bank name required"]
    }
});

export default mongoose.model("Bank", bankSchema);
