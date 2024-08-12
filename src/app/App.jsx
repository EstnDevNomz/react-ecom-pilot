import logo from "./logo.svg";
import "./styles/App.css";
import { runAiChat } from "../features/chat/services/ChatService";

function App() {
  console.log("App started");

  const userId = "테스트유저";
  const userIdsToInvite = [userId];
  const channelId =
    "sendbird_group_channel_202408712_bcc9a949df659ce22e7f84e39df8f1292b9d8e27";
  const channelName = "테스트 채널";
  const message = "당신은 누구입니까?";

  const params = {
    userId,
    userIdsToInvite,
    channelId,
    channelName,
    message,
  };

  runAiChat(params);

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
