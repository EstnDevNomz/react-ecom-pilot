import SendbirdChat, {
  SendbirdChatParams,
  User,
  SendbirdChatWith,
  ConnectionHandler,
} from '@sendbird/chat';
import SendbirdDesk from 'sendbird-desk';
import { info } from '../config/index.json';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';

const sendbirdOptions: SendbirdChatParams<[GroupChannelModule]> = {
  appId: info.appId,
  modules: [new GroupChannelModule()],
};

const sb: SendbirdChat & SendbirdChatWith<[GroupChannelModule]> =
  SendbirdChat.init(sendbirdOptions);

export { sb, User, SendbirdDesk, ConnectionHandler };
