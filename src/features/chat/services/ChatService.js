import {
  GroupChannelModule,
  GroupChannelFilter,
  GroupChannelListOrder,
  MessageFilter,
  MessageCollectionInitPolicy,
} from "@sendbird/chat/groupChannel";
import { sb } from "../sdk";

export const channelHandlers = {
  onChannelsAdded: (context, channels) => {
    console.log("onChannelsAdded", channels);
  },
  onChannelsDeleted: (context, channels) => {
    console.log("onChannelsDeleted", channels);
  },
  onChannelsUpdated: (context, channels) => {
    console.log("onChannelsUpdated", channels);
  },
};

export const messageHandlers = {
  onMessagesAdded: (context, channel, messages) => {
    console.log("onMessagesAdded", messages);
  },
  onMessagesUpdated: (context, channel, messages) => {
    console.log("onMessagesUpdated", messages);
  },
  onMessagesDeleted: (context, channel, messageIds) => {
    console.log("onMessagesDeleted", messageIds);
  },
  onChannelUpdated: (context, channel) => {
    console.log("onChannelUpdated", channel);
  },
  onChannelDeleted: (context, channelUrl) => {
    console.log("onChannelDeleted", channelUrl);
  },
  onHugeGapDetected: () => {
    console.log("onHugeGapDetected");
  },
};

export const onCacheResult = (err, messages) => {
  console.log("onCacheResult", messages);
};

export const onApiResult = (err, messages) => {
  console.log("onApiResult", messages);
};

export async function connectUser(userId) {
  console.log("Connecting to Sendbird...");
  // Connect to Sendbird
  try {
    const user = await sb.connect(userId);
    console.log("Connected to Sendbird: ", user);
    return [user, null];
  } catch (error) {
    return [null, error];
  }
}

export async function createGroupChannel(params) {
  try {
    const groupChannel = await sb.groupChannel.createChannel(params);
    return [groupChannel, null];
  } catch (error) {
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

export async function loadGroupChannel(userId, channelId) {
  // Load a group channel
  try {
    const channel = await sb.groupChannel.getChannel(channelId);
    return [channel, null];
  } catch (error) {
    console.error("Error loading Group Channel: ", error.message);
    return [null, error];
  }
}

export function sendUserMessage(channel, message) {
  console.log("Sending message...");
  channel
    .sendUserMessage({ message })
    .onPending(() => {
      console.log("Message pending...");
    })
    .onFailed((error, message) => {
      console.error("Message failed: ", error, message);
    })
    .onSucceeded((message) => {
      console.log("Message sent: ", message);
    });
}

export function loadMessages(channel, messageHandlers) {
  console.log("Loading messages...");
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

export async function runAiChat({
  userId,
  userIdsToInvite,
  channelId,
  channelName,
  message,
}) {
  const [user, connectError] = await connectUser(userId);
  if (connectError) {
    console.error("Error connecting user: ", connectError.message);
    return;
  }
  // Set channel invitation preference
  const result = await sb
    .setChannelInvitationPreference(true)
    .catch((error) => {
      console.error(
        "Error setting channel invitation preference: ",
        error.message
      );
    });
  if (!result.autoAccept) {
    console.error("Channel invitation preference not set");
    return;
  }

  const [loadedChannel, channelError] = await loadGroupChannel(
    userId,
    channelId
  );
  if (channelError) {
    const [createdChannel, error] = await createGroupChannel(
      userIdsToInvite,
      channelName
    );
    console.log("Group channels created: ", createdChannel);
    if (error) {
      console.error("Error creating Group Channel: ", error.message);
      return;
    }
    await createdChannel.inviteWithUserIds(["onboarding_bot"]);
    sendUserMessage(createdChannel, message);
    loadMessages(createdChannel, messageHandlers);
  } else {
    await loadedChannel.inviteWithUserIds(userIdsToInvite);
    sendUserMessage(loadedChannel, message);
    loadMessages(loadedChannel, messageHandlers);
  }
}
