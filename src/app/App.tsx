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
import { runAiChat } from '../features/chat';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import './styles/App.css';

function App() {
  console.log('App started');

  const userId: string = '테스트유저';
  const invitedUserIds = [userId];
  const operatorUserIds = [userId];
  const channelId: string =
    'sendbird_group_channel_202408712_bcc9a949df659ce22e7f84e39df8f1292b9d8e27';
  const name: string = '테스트 채널';
  const message: string = '당신은 누구입니까?';

  const params: GroupChannelCreateParams = {
    invitedUserIds,
    name,
    operatorUserIds,
  };

  runAiChat(userId, channelId, message, params);

  return (
    <RecoilRoot>
      <ThemeProvider theme={{}}>
        <div
          className="App"
          style={{ width: '100vw', height: '100vh', textAlign: 'left' }}
        >
          <SendbirdApp appId={info.appId} userId="테스트유저" />
        </div>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
