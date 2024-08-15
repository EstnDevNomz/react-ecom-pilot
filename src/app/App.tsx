import React from 'react';
import logo from './assets/images/logo.svg';
import './styles/App.css';
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

const App: React.FC = () => {
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
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
