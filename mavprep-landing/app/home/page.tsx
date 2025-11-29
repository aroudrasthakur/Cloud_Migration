"use client";

import { useState, useMemo, useRef, useEffect } from "react";

type Channel = {
  id: string;
  name: string;
  type: "text" | "voice";
  privacy?: "public" | "private";
  password?: string;
  editable?: boolean;
};

const DEFAULT_CHANNELS: Channel[] = [
  {
    id: "c-1",
    name: "Final Review - Data Structures",
    type: "text",
    privacy: "public",
  },
  {
    id: "c-2",
    name: "Last Minute Q&A - Algorithms",
    type: "text",
    privacy: "public",
  },
  { id: "c-3", name: "Group Study - Systems", type: "text", privacy: "public" },
  {
    id: "c-4",
    name: "Project Help - Databases",
    type: "text",
    privacy: "public",
  },
  { id: "v-1", name: "Voice: Study Room A", type: "voice", privacy: "public" },
  { id: "v-2", name: "Voice: Silent Focus", type: "voice", privacy: "public" },
];

export default function HomePage() {
  const [channels, setChannels] = useState<Channel[]>(DEFAULT_CHANNELS);
  const [query, setQuery] = useState("");

  // Voice call state
  const [activeCall, setActiveCall] = useState<null | {
    channelId: string;
    name: string;
    privacy: "public" | "private";
    password?: string;
  }>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [callPassword, setCallPassword] = useState("");
  const [callError, setCallError] = useState<string | null>(null);
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected");

  const socketRef = useRef<any>(null);
  const peersRef = useRef<{ [id: string]: any }>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioRefs = useRef<{ [id: string]: HTMLAudioElement }>({});
  const userIdRef = useRef<string>("");

  // Setup WebRTC when joining a call
  useEffect(() => {
    if (!inCall || !activeCall) return;

    let mounted = true;
    setConnectionStatus("Connecting...");

    // Generate consistent user ID
    if (!userIdRef.current) {
      userIdRef.current = `user_${Math.random().toString(36).substr(2, 9)}`;
    }
    const userId = userIdRef.current;

    // Get local audio first
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;
        setConnectionStatus("Connected");

        // Connect to signaling server - simplified path
        const socket = (window as any).io?.("/api/webrtc-signaling", {
          transports: ["websocket", "polling"],
          reconnection: true,
        });

        if (!socket) {
          setCallError("Socket.IO not available. Please check server setup.");
          setConnectionStatus("Error");
          return;
        }

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
          setConnectionStatus("Joining room...");
          // Join room after connection
          socket.emit("join-room", { roomId: activeCall.channelId, userId });
        });

        socket.on("room-joined", ({ memberCount }: { memberCount: number }) => {
          console.log("Joined room with", memberCount, "members");
          setConnectionStatus(`Connected (${memberCount} in room)`);
          setParticipants(Array(memberCount - 1).fill("User"));
        });

        socket.on("user-joined", ({ userId: remoteId, socketId }: any) => {
          console.log("User joined:", remoteId);
          if (!mounted) return;

          setParticipants((prev) => [...prev, remoteId]);

          // Create peer using simple-peer-like logic (simplified)
          // In production, you'd use actual SimplePeer here
          console.log("Would create peer connection to:", remoteId);
        });

        socket.on("signal", (data: any) => {
          console.log("Received signal:", data);
          const { senderId } = data;
          // Handle WebRTC signaling
          // In production, pass to SimplePeer
        });

        socket.on("user-left", ({ userId: remoteId }: any) => {
          console.log("User left:", remoteId);
          if (!mounted) return;

          setParticipants((prev) => prev.filter((id) => id !== remoteId));
          if (peersRef.current[remoteId]) {
            peersRef.current[remoteId].destroy?.();
            delete peersRef.current[remoteId];
          }
          removeRemoteAudio(remoteId);
        });

        socket.on("connect_error", (error: any) => {
          console.error("Socket connection error:", error);
          setConnectionStatus("Connection error");
          setCallError("Failed to connect to voice server");
        });

        socket.on("error", ({ message }: { message: string }) => {
          console.error("Socket error:", message);
          setCallError(message);
        });
      })
      .catch((err) => {
        console.error("Failed to get audio:", err);
        setCallError("Failed to access microphone. Please check permissions.");
        setConnectionStatus("Error");
        setInCall(false);
      });

    // Cleanup on unmount or when leaving call
    return () => {
      mounted = false;
      setConnectionStatus("Disconnected");

      if (socketRef.current) {
        socketRef.current.emit("leave-room", {
          roomId: activeCall.channelId,
          userId: userIdRef.current,
        });
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      Object.values(peersRef.current).forEach((peer) => {
        peer.destroy?.();
      });
      peersRef.current = {};

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }

      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.srcObject = null;
      });
      audioRefs.current = {};

      setParticipants([]);
    };
  }, [inCall, activeCall]);

  function playRemoteAudio(id: string, stream: MediaStream) {
    let audio = audioRefs.current[id];
    if (!audio) {
      audio = new Audio();
      audio.autoplay = true;
      audioRefs.current[id] = audio;
    }
    audio.srcObject = stream;
    audio.play().catch((err) => console.error("Audio play error:", err));
  }

  function removeRemoteAudio(id: string) {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.pause();
      audio.srcObject = null;
      delete audioRefs.current[id];
    }
  }

  function toggleMute() {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }

  // Add channel modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<"text" | "voice">("text");
  const [newName, setNewName] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [password, setPassword] = useState("");
  const [maxMembers, setMaxMembers] = useState<number>(10);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return channels;
    return channels.filter((ch) => ch.name.toLowerCase().includes(q));
  }, [channels, query]);

  function resetForm() {
    setNewType("text");
    setNewName("");
    setNewCourse("");
    setPrivacy("public");
    setPassword("");
    setMaxMembers(10);
    setFormError(null);
  }

  function createChannel() {
    if (!newName.trim()) {
      setFormError("Please enter a channel name.");
      return;
    }
    if (!newCourse.trim()) {
      setFormError("Please enter the related course.");
      return;
    }
    if (privacy === "private" && !password) {
      setFormError("Private channels require a password.");
      return;
    }
    if (maxMembers < 1 || maxMembers > 10) {
      setFormError("Max members must be between 1 and 10.");
      return;
    }

    const id = `${newType}-${Date.now()}`;
    const payload: Channel = {
      id,
      name: `${newName} — ${newCourse}`,
      type: newType,
      privacy,
      password: privacy === "private" ? password : undefined,
    };

    setChannels((prev) => [payload, ...prev]);
    setShowAddModal(false);
    resetForm();
  }

  function handleJoinVoiceChannel(ch: Channel) {
    const channel = channels.find((x) => x.id === ch.id);
    const channelPrivacy = channel?.privacy || "public";

    if (channelPrivacy === "private") {
      setActiveCall({
        channelId: ch.id,
        name: ch.name,
        privacy: channelPrivacy,
        password: channel?.password,
      });
      setShowPasswordPrompt(true);
    } else {
      setActiveCall({
        channelId: ch.id,
        name: ch.name,
        privacy: channelPrivacy,
      });
      setInCall(true);
    }
  }

  function handlePasswordSubmit() {
    if (!activeCall) return;

    if (callPassword.length < 1) {
      setCallError("Password required");
      return;
    }

    // Verify password
    if (activeCall.password && callPassword !== activeCall.password) {
      setCallError("Incorrect password");
      return;
    }

    setInCall(true);
    setShowPasswordPrompt(false);
    setCallError(null);
  }

  function handleLeaveCall() {
    setActiveCall(null);
    setInCall(false);
    setCallPassword("");
    setCallError(null);
    setShowPasswordPrompt(false);
    setIsMuted(false);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Left Sidebar - Discord-like channels */}
        <aside className="w-72 border-r border-gray-800 min-h-screen px-4 py-6 bg-gray-900/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold neon-text-glow">MavPrep</h2>
            <div className="text-xs text-gray-400">Guest</div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search channels..."
              className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg placeholder-gray-500 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={() => setShowAddModal(true)}
              aria-label="Create channel"
              className="w-10 h-10 rounded-lg bg-primary text-black flex items-center justify-center text-xl font-bold hover:bg-accent transition-colors"
            >
              +
            </button>
          </div>

          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="w-full max-w-md p-6 bg-gradient-to-br from-[#041022] via-[#00131a] to-[#001f2b] border border-primary/30 rounded-xl shadow-[0_20px_60px_rgba(0,217,255,0.08)]">
                <h3 className="text-xl font-semibold mb-6">Create Channel</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewType("text")}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          newType === "text"
                            ? "bg-primary text-black"
                            : "bg-black border border-gray-700 text-gray-200 hover:border-gray-600"
                        }`}
                      >
                        Text
                      </button>
                      <button
                        onClick={() => setNewType("voice")}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          newType === "voice"
                            ? "bg-primary text-black"
                            : "bg-black border border-gray-700 text-gray-200 hover:border-gray-600"
                        }`}
                      >
                        Voice
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Channel Name
                    </label>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. Final Review"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Course
                    </label>
                    <input
                      value={newCourse}
                      onChange={(e) => setNewCourse(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. CSE 2312"
                    />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-2">
                        Visibility
                      </label>
                      <select
                        value={privacy}
                        onChange={(e) =>
                          setPrivacy(e.target.value as "public" | "private")
                        }
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-2">
                        Max Members
                      </label>
                      <div className="flex items-center bg-black border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            setMaxMembers((m) => Math.max(1, m - 1))
                          }
                          className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                          aria-label="decrease"
                        >
                          −
                        </button>
                        <div className="px-3 py-2 text-sm flex-1 text-center border-x border-gray-700">
                          {maxMembers}
                        </div>
                        <button
                          onClick={() =>
                            setMaxMembers((m) => Math.min(10, m + 1))
                          }
                          className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                          aria-label="increase"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {privacy === "private" && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Password
                      </label>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="Enter a password"
                      />
                    </div>
                  )}

                  {formError && (
                    <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                      {formError}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createChannel}
                      className="px-4 py-2 rounded-lg bg-primary text-black text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-4">
            <div>
              <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Text Channels
              </h3>
              <ul className="space-y-1">
                {filtered
                  .filter((c) => c.type === "text")
                  .map((ch) => (
                    <li
                      key={ch.id}
                      className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800/50 cursor-pointer"
                    >
                      <span className="text-primary">#</span>
                      <span className="text-sm text-gray-200">{ch.name}</span>
                      {ch.privacy === "private" && (
                        <span className="text-xs text-gray-500">🔒</span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Voice Channels
              </h3>
              <ul className="space-y-1">
                {filtered
                  .filter((c) => c.type === "voice")
                  .map((ch) => (
                    <li
                      key={ch.id}
                      className={`flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800/50 cursor-pointer ${
                        inCall && activeCall?.channelId === ch.id
                          ? "bg-primary/20 border-l-2 border-primary"
                          : ""
                      }`}
                      onClick={() => !inCall && handleJoinVoiceChannel(ch)}
                    >
                      <span className="text-accent">♪</span>
                      <span className="text-sm text-gray-200">{ch.name}</span>
                      {ch.privacy === "private" && (
                        <span className="text-xs text-gray-500">🔒</span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </nav>

          {/* Active Call Indicator */}
          {inCall && activeCall && (
            <div className="mt-6 p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="text-xs text-primary mb-2">Voice Connected</div>
              <div className="text-sm font-medium mb-2">{activeCall.name}</div>
              <div className="text-xs text-gray-400 mb-3">
                {connectionStatus}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleMute}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isMuted
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-gray-800 text-gray-300 border border-gray-700"
                  }`}
                >
                  {isMuted ? "🔇 Unmute" : "🔊 Mute"}
                </button>
                <button
                  onClick={handleLeaveCall}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium hover:bg-red-500/30 transition-colors"
                >
                  Leave
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main Area */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold neon-text-glow">Study Rooms</h2>
              <div className="text-sm text-gray-400">
                Browse study groups and voice rooms
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {channels.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-400 uppercase">
                          {c.type === "text" ? "Text" : "Voice"}
                        </div>
                        {c.privacy === "private" && (
                          <span className="text-xs text-gray-500">🔒</span>
                        )}
                      </div>
                      <div className="font-semibold text-lg mt-1">{c.name}</div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {participants.length > 0 && c.type === "voice"
                        ? `${participants.length} active`
                        : "—"}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mt-3">
                    A place to study and prep for finals.
                  </p>
                  {c.type === "voice" && (
                    <button
                      onClick={() => !inCall && handleJoinVoiceChannel(c)}
                      disabled={inCall && activeCall?.channelId === c.id}
                      className="mt-3 w-full px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-primary/30"
                    >
                      {inCall && activeCall?.channelId === c.id
                        ? "Currently Connected"
                        : "Join Voice"}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Password Prompt Modal */}
            {showPasswordPrompt && activeCall && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="w-full max-w-md p-6 bg-gradient-to-br from-[#041022] via-[#00131a] to-[#001f2b] border border-primary/30 rounded-xl shadow-[0_20px_60px_rgba(0,217,255,0.08)]">
                  <h3 className="text-xl font-semibold mb-4">
                    Join Voice Channel
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    This is a private voice channel. Enter the password to join.
                  </p>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={callPassword}
                      onChange={(e) => {
                        setCallPassword(e.target.value);
                        setCallError(null);
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handlePasswordSubmit()
                      }
                      className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter password"
                      autoFocus
                    />
                    {callError && (
                      <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mt-2">
                        {callError}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowPasswordPrompt(false);
                        setActiveCall(null);
                        setCallPassword("");
                        setCallError(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordSubmit}
                      className="px-4 py-2 rounded-lg bg-primary text-black text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
