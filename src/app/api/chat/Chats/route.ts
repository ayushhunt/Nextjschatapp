import Message from '@/app/models/Message';
import User from '@/app/models/User';
import { connectToDatabase } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';

export async function GET(request: Request) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const decodedToken = verifyToken(token);
        const { userId } = decodedToken as { userId: string };

        await connectToDatabase();

        // Find all messages where the current user is either the sender or the recipient
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { recipient: userId },
            ],
        });

        // Extract unique user IDs the current user has interacted with
        const interactedUserIds = new Set<string>();

        messages.forEach((message) => {
            if (message.sender.toString() !== userId) {
                interactedUserIds.add(message.sender.toString());
            }
            if (message.recipient.toString() !== userId) {
                interactedUserIds.add(message.recipient.toString());
            }
        });

        // Fetch the details of the interacted users from the User model
        const interactedUsers = await User.find({
            _id: { $in: Array.from(interactedUserIds) },
        }).select('-password'); // Exclude password for security

        return NextResponse.json({ users: interactedUsers });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching interacted users', error: error.message }, { status: 400 });
    }
}
