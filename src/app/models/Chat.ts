import mongoose from "mongoose";
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  chatName: {
    type: String,
    required: function() { return this.isGroupChat; }, // Only required for group chats
  },
  latestMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
}, { timestamps: true });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
export default Chat;
