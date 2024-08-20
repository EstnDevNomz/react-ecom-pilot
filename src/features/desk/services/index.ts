import { CreateTicketParams } from 'sendbird-desk';
import { sb, User, SendbirdDesk, ConnectionHandler } from '../sdk';

export async function connectDesk(
  userId: string,
  accessToken: string,
): Promise<boolean> {
  console.log('..Connecting to Sendbird Desk');
  try {
    const user: User = await sb.connect(userId, accessToken);
    console.log('Connected to Sendbird Chat:', user);
    if (!user) {
      throw new Error('Failed to connect to Sendbird Chat');
    }
    SendbirdDesk.init(sb);
    SendbirdDesk.authenticate(userId, accessToken, () => {
      const connectionHandler = new ConnectionHandler();
      connectionHandler.onReconnectStarted = () => {
        console.log('Reconnecting to Sendbird Desk');
      };
      connectionHandler.onReconnectSucceeded = () => {
        console.log('Reconnected to Sendbird Desk');
      };
      connectionHandler.onReconnectFailed = () => {
        console.error('Failed to reconnect to Sendbird Desk');
      };
    });
    console.log('Connected to Sendbird Desk');
  } catch (error) {
    console.error('Failed to connect to Sendbird Desk:', error);
    return false;
  }
  return true;
}

export function createTicket(title: string, name: string): boolean {
  console.log('..Creating ticket');
  try {
    SendbirdDesk.Ticket.create(title, name, (ticket, err) => {
      if (err) throw err;
      console.log('The ticket is created:', ticket);
      // The customer and agent can chat with each other by sending a message through the ticket.channel.sendUserMessage() or sendFileMessage().
      // The ticket.channel property indicates the group channel object within the ticket.
    });
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return false;
  }
  return true;
}
