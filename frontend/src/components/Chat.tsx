import React, { useEffect, useRef, useState } from "react";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // FastAPI の /ws エンドポイントに接続
    ws.current = new WebSocket("ws://localhost:8000/ws");
    ws.current.onmessage = (e) => {
      setMessages(prev => [...prev, e.data]);
    };
    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(input);
      setInput("");
    }
  };

  return (
    <div>
      <h2>一旦チャットテスト</h2>
      <div style={{
        border: "1px solid #ccc",
        padding: 8,
        height: 200,
        overflowY: "auto"
      }}>
        {messages.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;