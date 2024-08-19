import {
  GroupChannel,
  GroupChannelModule,
  GroupChannelFilter,
  GroupChannelListOrder,
  GroupChannelCreateParams,
  MessageFilter,
  MessageCollectionInitPolicy,
} from '@sendbird/chat/groupChannel';
import { sb, User } from '../sdk';
import { InvitationPreference } from '@sendbird/chat/lib/__definition';

export const channelHandlers = {
  onChannelsAdded: (context: any, channels: any) => {
    console.log('onChannelsAdded', channels);
  },
  onChannelsDeleted: (context: any, channels: any) => {
    console.log('onChannelsDeleted', channels);
  },
  onChannelsUpdated: (context: any, channels: any) => {
    console.log('onChannelsUpdated', channels);
  },
};

export const messageHandlers = {
  onMessagesAdded: (context: any, channel: any, messages: any) => {
    console.log('onMessagesAdded', messages);
  },
  onMessagesUpdated: (context: any, channel: any, messages: any) => {
    console.log('onMessagesUpdated', messages);
  },
  onMessagesDeleted: (context: any, channel: any, messageIds: any) => {
    console.log('onMessagesDeleted', messageIds);
  },
  onChannelUpdated: (context: any, channel: any) => {
    console.log('onChannelUpdated', channel);
  },
  onChannelDeleted: (context: any, channelUrl: any) => {
    console.log('onChannelDeleted', channelUrl);
  },
  onHugeGapDetected: () => {
    console.log('onHugeGapDetected');
  },
};

export const onCacheResult = (err: any, messages: any) => {
  console.log('onCacheResult', messages);
};

export const onApiResult = (err: any, messages: any) => {
  console.log('onApiResult', messages);
};

export async function connectUser(userId: string) {
  console.log('Connecting to Sendbird...');
  // Connect to Sendbird
  try {
    const user: User = await sb.connect(userId);
    console.log('Connected to Sendbird: ', user);
    return [user, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function createGroupChannel(params: GroupChannelCreateParams) {
  try {
    const groupChannel: GroupChannel =
      await sb.groupChannel.createChannel(params);
    return [groupChannel, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function getGroupChannels() {
  try {
    const collection = sb.groupChannel.createGroupChannelCollection({
      filter: new GroupChannelFilter(),
      order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
    });
    collection.setGroupChannelCollectionHandler(channelHandlers);
    const channels = await collection.loadMore();

    return [channels, null];
  } catch (error) {
    return [null, error];
  }
}

export async function loadGroupChannel(channelId: string) {
  // Load a group channel
  try {
    const channel: GroupChannel = await sb.groupChannel.getChannel(channelId);
    return [channel, null];
  } catch (error: any) {
    console.error('Error loading Group Channel: ', error.message);
    return [null, error];
  }
}

export function sendUserMessage(
  channel: {
    sendUserMessage: (arg0: { message: any }) => {
      (): any;
      new (): any;
      onPending: {
        (arg0: () => void): {
          (): any;
          new (): any;
          onFailed: {
            (arg0: (error: any, message: any) => void): {
              (): any;
              new (): any;
              onSucceeded: {
                (arg0: (message: any) => void): void;
                new (): any;
              };
            };
            new (): any;
          };
        };
        new (): any;
      };
    };
  },
  message: string,
) {
  console.log('Sending message...');
  channel
    .sendUserMessage({ message })
    .onPending(() => {
      console.log('Message pending...');
    })
    .onFailed((error: any, message: any) => {
      console.error('Message failed: ', error, message);
    })
    .onSucceeded((message: any) => {
      console.log('Message sent: ', message);
    });
}

export function loadMessages(
  channel: {
    createMessageCollection: (arg0: {
      filter: MessageFilter;
      startingPoint: number;
      limit: number;
    }) => any;
  },
  messageHandlers: {
    onMessagesAdded: (context: any, channel: any, messages: any) => void;
    onMessagesUpdated: (context: any, channel: any, messages: any) => void;
    onMessagesDeleted: (context: any, channel: any, messageIds: any) => void;
    onChannelUpdated: (context: any, channel: any) => void;
    onChannelDeleted: (context: any, channelUrl: any) => void;
    onHugeGapDetected: () => void;
  },
) {
  console.log('Loading messages...');
  const messageFilter = new MessageFilter();

  const collection = channel.createMessageCollection({
    filter: messageFilter,
    startingPoint: Date.now(),
    limit: 100,
  });

  try {
    collection.setMessageCollectionHandler(messageHandlers);
    collection
      .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
      .onCacheResult(onCacheResult)
      .onApiResult(onApiResult);
    return [collection, null];
  } catch (error) {
    return [null, error];
  }
}

export async function runAiChat(
  userId: string,
  channelId: string,
  message: string,
  params: GroupChannelCreateParams,
) {
  const [user, connectError] = await connectUser(userId);
  if (connectError) {
    console.error('Error connecting user: ', connectError.message);
    return [null, connectError];
  }
  // Set channel invitation preference
  const result: void | InvitationPreference = await sb
    .setChannelInvitationPreference(true)
    .catch((error) => {
      console.error(
        'Error setting channel invitation preference: ',
        error.message,
      );
    });

  if (!result) {
    console.error('Channel invitation preference not set');
    return [null, result];
  }
  const [loadedChannel, channelError] = await loadGroupChannel(channelId);

  if (channelError) {
    const [createdChannel, error] = await createGroupChannel(params);
    console.log('Group channels created: ', createdChannel);
    if (error) {
      console.error('Error creating Group Channel: ', error.message);
      return [null, error];
    }
    const botId: string = 'onboarding_bot';
    await createdChannel.inviteWithUserIds([botId]);
    sendUserMessage(createdChannel, message);
    loadMessages(createdChannel, messageHandlers);
  } else {
    try {
      await loadedChannel.inviteWithUserIds(params.invitedUserIds);
      sendUserMessage(loadedChannel, message);
      loadMessages(loadedChannel, messageHandlers);
    } catch (error: any) {
      console.error('Error inviting users to channel: ', error.message);
      return [null, error];
    }
  }
}
