import SendbirdChat, { SendbirdChatParams, User, SendbirdChatWith } from "@sendbird/chat";
import { OpenChannelModule } from "@sendbird/chat/openChannel";
import {
  GroupChannelModule,
  GroupChannelFilter,
  GroupChannelListOrder,
  MessageFilter,
  MessageCollectionInitPolicy,
} from "@sendbird/chat/groupChannel";
import { info } from "../config/index.json";

const sendbirdOptions: SendbirdChatParams<[OpenChannelModule, GroupChannelModule]> = {
  appId: info.appId,
  localCacheEnabled: true,
  modules: [new OpenChannelModule(), new GroupChannelModule()],
}

const sb: SendbirdChat & SendbirdChatWith<[OpenChannelModule, GroupChannelModule]> = SendbirdChat.init(sendbirdOptions);

export { sb, User };
