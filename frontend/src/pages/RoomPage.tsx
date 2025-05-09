import React, { useEffect, useState, FormEvent } from "react";

interface Room {
  id: number;
  name: string;
  max_players: number;
  is_open: boolean;
}

export const RoomPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // ルーム一覧を取得
  const fetchRooms = async () => {
    try {
      const res = await fetch("/rooms", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data: Room[] = await res.json();
      setRooms(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ルーム作成
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name, max_players: maxPlayers }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create room");
      }
      setName("");
      setMaxPlayers(8);
      await fetchRooms();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ルーム参加
  const handleJoin = async (roomId: number) => {
    setError(null);
    try {
      const res = await fetch(`/rooms/${roomId}/join`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to join room");
      }
      alert("ルームに参加しました！");
      // 参加後はゲーム画面に遷移するなど
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>Room Management</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ marginBottom: 40 }}>
        <h2>Create Room</h2>
        <form onSubmit={handleCreate}>
          <div>
            <label>Room Name:</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Max Players:</label>
            <input
              type="number"
              value={maxPlayers}
              onChange={e => setMaxPlayers(Number(e.target.value))}
              min={2}
              max={20}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </section>

      <section>
        <h2>Open Rooms</h2>
        <ul>
          {rooms.map(room => (
            <li key={room.id}>
              {room.name} (max: {room.max_players})
              <button
                onClick={() => handleJoin(room.id)}
                style={{ marginLeft: 10 }}
                disabled={!room.is_open}
              >
                {room.is_open ? "Join" : "Closed"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};