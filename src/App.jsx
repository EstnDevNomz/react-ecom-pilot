import logo from "./logo.svg";
import "./App.css";
import {
  GroupChannelModule,
  GroupChannelFilter,
  GroupChannelListOrder,
  MessageFilter,
  MessageCollectionInitPolicy,
} from "@sendbird/chat/groupChannel";
import { sb } from "./services/sendbird/sendbirdSdk.js";

const channelHandlers = {
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

const messageHandlers = {
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

const onCacheResult = (err, messages) => {
  console.log("onCacheResult", messages);
};

const onApiResult = (err, messages) => {
  console.log("onApiResult", messages);
};

async function connectUser(userId) {
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

async function createGroupChannel(params) {
  try {
    const groupChannel = await sb.groupChannel.createChannel(params);
    return [groupChannel, null];
  } catch (error) {
    return [null, error];
  }
}

async function getGroupChannels() {
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

async function loadGroupChannel(userId, channelId) {
  // Load a group channel
  try {
    const channel = await sb.groupChannel.getChannel(channelId);
    return [channel, null];
  } catch (error) {
    console.error("Error loading Group Channel: ", error.message);
    return [null, error];
  }
}

async function runAIChat() {
  const userId = "테스트유저";
  const userIdsToInvite = [userId];
  const channelId =
    "sendbird_group_channel_202408712_bcc9a949df659ce22e7f84e39df8f1292b9d8e27";
  const channelName = "테스트 채널";
  const message = "당신은 누구입니까?";

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

function sendUserMessage(channel, message) {
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

function loadMessages(channel, messageHandlers) {
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

function App() {
  console.log("App started");
  runAIChat();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
