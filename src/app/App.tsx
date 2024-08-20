import React from 'react';
import logo from './assets/images/logo.svg';
import { info } from '../features/chat/config/index.json';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { ThemeProvider } from 'styled-components';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { App as SendbirdApp, TypingIndicatorType } from '@sendbird/uikit-react';
import { runAiChat } from '../features/chat';
import { connectDesk, createTicket } from '../features/desk';

import '@sendbird/uikit-react/dist/index.css';
import './styles/App.css';

function App() {
  console.log('App started');

  const userId: string = '테스트유저';
  const accessToken: string = '90a4183c107e56aafbba4da2a9cf4d74ccf25ebe';

  connectDesk(userId, accessToken);
  // createTicket('Sample Ticket', 'John Doe');

  // const invitedUserIds = [userId];
  // const operatorUserIds = [userId];
  // const channelId: string =
  //   'sendbird_group_channel_203190455_ee896647d5597a8d7532ed958ae83e4125da8cdb';
  // const name: string = '테스트 채널';
  // const message: string = '당신은 누구입니까?';

  // const params: GroupChannelCreateParams = {
  //   invitedUserIds,
  //   name,
  //   operatorUserIds,
  // };

  // runAiChat(userId, channelId, message, params);

  return (
    <RecoilRoot>
      <ThemeProvider theme={{}}>
        <div
          className="App"
          style={{ width: '100vw', height: '100vh', textAlign: 'left' }}
        >
          {/* <SendbirdApp
            appId={info.appId}
            userId="테스트유저"
            uikitOptions={{
              groupChannel: {
                enableMention: true,
                enableMarkdownForUserMessage: true,
                enableVoiceMessage: true,
                enableTypingIndicator: true,
                typingIndicatorTypes: new Set([
                  TypingIndicatorType.Bubble,
                  TypingIndicatorType.Text,
                ]),
              },
              groupChannelList: {
                enableTypingIndicator: true,
              },
            }}
          /> */}
        </div>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
