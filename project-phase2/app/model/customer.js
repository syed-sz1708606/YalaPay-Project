import mongoose from "mongoose";

const Schema = mongoose.Schema;

const options = {
  toJSON: {
    virtuals: true
  }
};

const addressSchema = mongoose.Schema({
  street: {
    type: String,
    required: [true, "street required"],
  },
  city: {
    type: String,
    required: [true, "city required"],
  },
  country: {
    type: String,
    required: [true, "country required"],
  },
});

const contactSchema = mongoose.Schema({
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
  mobile: {
    type: String,
    required: [true, "Mobile required"],
  },
});

const customerSchema = new Schema({
  companyName: {
    type: String,
    required: [true, "Company Name required"]
  },
  address: {
    type: addressSchema,
  },
  contactDetails: {
    type: contactSchema,
  },
}, options);


customerSchema.virtual('customerId').get(function () {
  return this._id
})

export default mongoose.model("Customer", customerSchema);
