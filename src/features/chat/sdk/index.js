import SendbirdChat from "@sendbird/chat";
import { OpenChannelModule } from "@sendbird/chat/openChannel";
import {
  GroupChannelModule,
  GroupChannelFilter,
  GroupChannelListOrder,
  MessageFilter,
  MessageCollectionInitPolicy,
} from "@sendbird/chat/groupChannel";
import { info } from "../config";

const sb = SendbirdChat.init({
  appId: info.appId,
  localCacheEnabled: true,
  modules: [new OpenChannelModule(), new GroupChannelModule()],
});

export { sb };
