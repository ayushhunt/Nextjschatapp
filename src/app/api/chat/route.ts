import Message from '@/app/models/Message';
import { connectToDatabase } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';

export async function POST(request: Request) {
    const token = request.cookies.get('token')?.value;
  
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
      const decodedToken = verifyToken(token);
      const { userId } = decodedToken as { userId: string };
  
      const { recipient, content } = await request.json();
      console.log(recipient);
      console.log(content);
      await connectToDatabase();
  
      const newMessage = new Message({
        sender: userId,
        recipient: recipient,
        content,
      });
  
      await newMessage.save();
  
      return NextResponse.json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
      return NextResponse.json({ message: 'Error sending message', error: error.message }, { status: 400 });
    }
  }

  export async function GET(request: Request) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const decodedToken = verifyToken(token);
        const { userId } = decodedToken as { userId: string };

        const url = new URL(request.url); // Create a URL object to parse the query
        const recipientId = url.searchParams.get('recipientId'); // Get the recipientId from query parameters

        if (!recipientId) {
            return NextResponse.json({ message: 'recipientId is required' }, { status: 400 });
        }

        await connectToDatabase();

        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: recipientId },
                { sender: recipientId, recipient: userId },
            ],
        }).sort({ createdAt: 1 }); // Sort messages by createdAt timestamp

        return NextResponse.json({ messages });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching message history', error: error.message }, { status: 400 });
    }
}