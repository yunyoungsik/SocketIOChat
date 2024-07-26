import { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));
      socket.on('chat', (msg) => setMessages((prev) => [...prev, msg]));

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('chat');
      };
    }
  }, [socket]);

  const connectToChatServer = (event) => {
    event.preventDefault();
    const _socket = io('http://localhost:3000', {
      autoConnect: false,
      query: { username },
    });
    _socket.connect();
    setSocket(_socket);
  };

  const disconnectFromChatServer = (event) => {
    event.preventDefault();
    socket?.disconnect();
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (userInput.trim()) {
      socket?.emit('chat', { username, message: userInput });
      setUserInput('');
    }
  };

  return (
    <div className="wrap">
      <header className="header">
        <div className={`connect ${isConnected ? 'on' : 'off'}`} />

        <div className="name">
          <form onSubmit={isConnected ? disconnectFromChatServer : connectToChatServer}>
            {isConnected ? (
              <h1>{username}</h1>
            ) : (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="사용자 이름 입력"
              />
            )}
            <button type="submit">
              {isConnected ? '종료' : '접속'}
            </button>
          </form>
        </div>
      </header>

      <main className="main">
        <ul className="chatList">
          {messages.map((message, i) => (
            <li key={i}>
              {message.username}: {message.message}
            </li>
          ))}
        </ul>

        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="메시지 입력"
          />
          <button type="submit">&gt;</button>
        </form>
      </main>
    </div>
  );
}

export default App;
