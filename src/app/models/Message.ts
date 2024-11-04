import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {  // Changed chat to recipient
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  readBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
