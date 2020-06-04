/* eslint-disable arrow-body-style */
import mongoose, { Mongoose } from 'mongoose';

const connect = (uri = String(process.env.MONGO_URI)): Promise<Mongoose> => {
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

export default connect;
