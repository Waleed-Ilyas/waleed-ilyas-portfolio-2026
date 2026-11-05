"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = {
  id: number;
  author: "me" | "them";
  text: string;
  time: string;
  reactions: string[];
};
type Chat = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: string;
  preview: string;
  unread: number;
  group?: boolean;
  messages: Message[];
};

const initialChats: Chat[] = [
  {
    id: "maya",
    name: "Maya Chen",
    avatar: "MC",
    color: "lilac",
    status: "online",
    preview: "That makes sense — let’s try it.",
    unread: 2,
    messages: [
      {
        id: 1,
        author: "them",
        text: "Hey! I added a few notes to the new board. Want to take a look?",
        time: "10:24",
        reactions: [],
      },
      {
        id: 2,
        author: "me",
        text: "Just saw them. The flow is much clearer now.",
        time: "10:26",
        reactions: ["✨ 1"],
      },
      {
        id: 3,
        author: "them",
        text: "That makes sense — let’s try it.",
        time: "10:28",
        reactions: [],
      },
    ],
  },
  {
    id: "studio",
    name: "Studio team",
    avatar: "ST",
    color: "peach",
    status: "3 members",
    preview: "Noah: Sharing the first draft",
    unread: 0,
    group: true,
    messages: [
      {
        id: 1,
        author: "them",
        text: "Noah: Sharing the first draft for everyone to review.",
        time: "09:52",
        reactions: [],
      },
      {
        id: 2,
        author: "me",
        text: "Thanks! I’ll leave a few comments this afternoon.",
        time: "09:55",
        reactions: [],
      },
    ],
  },
  {
    id: "leo",
    name: "Leo Park",
    avatar: "LP",
    color: "mint",
    status: "last seen 8m ago",
    preview: "Voice note · 0:18",
    unread: 0,
    messages: [
      { id: 1, author: "them", text: "Voice note · 0:18", time: "Yesterday", reactions: [] },
    ],
  },
  {
    id: "product",
    name: "Product notes",
    avatar: "PN",
    color: "blue",
    status: "You, Maya, Leo",
    preview: "You: Perfect, thank you!",
    unread: 0,
    group: true,
    messages: [
      {
        id: 1,
        author: "them",
        text: "Maya: The research summary is ready to read.",
        time: "Yesterday",
        reactions: [],
      },
      { id: 2, author: "me", text: "Perfect, thank you!", time: "Yesterday", reactions: [] },
    ],
  },
  {
    id: "amara",
    name: "Amara Okafor",
    avatar: "AO",
    color: "gold",
    status: "offline",
    preview: "See you tomorrow 👋",
    unread: 0,
    messages: [{ id: 1, author: "them", text: "See you tomorrow 👋", time: "Mon", reactions: [] }],
  },
];

export default function ChatVersePage() {
  const [chats, setChats] = useState(initialChats);
  const [activeId, setActiveId] = useState("maya");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const active = chats.find((chat) => chat.id === activeId) ?? chats[0];
  const filtered = useMemo(
    () =>
      chats.filter((chat) =>
        `${chat.name} ${chat.preview}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [chats, query],
  );

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const now = new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(
      new Date(),
    );
    setChats((current) =>
      current.map((chat) =>
        chat.id === active.id
          ? {
              ...chat,
              preview: `You: ${text}`,
              messages: [
                ...chat.messages,
                { id: Date.now(), author: "me", text, time: now, reactions: [] },
              ],
            }
          : chat,
      ),
    );
    setDraft("");
  };

  const addReaction = (messageId: number, emoji: string) =>
    setChats((current) =>
      current.map((chat) =>
        chat.id !== active.id
          ? chat
          : {
              ...chat,
              messages: chat.messages.map((message) =>
                message.id === messageId
                  ? {
                      ...message,
                      reactions: message.reactions.includes(emoji)
                        ? message.reactions.filter((item) => item !== emoji)
                        : [...message.reactions, emoji],
                    }
                  : message,
              ),
            },
      ),
    );

  const handleAttachment = (file?: File) => {
    if (!file) return;
    setChats((current) =>
      current.map((chat) =>
        chat.id === active.id
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: Date.now(),
                  author: "me",
                  text: `📎 ${file.name} · local preview only`,
                  time: new Intl.DateTimeFormat("en", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date()),
                  reactions: [],
                },
              ],
            }
          : chat,
      ),
    );
  };

  const createChat = () => {
    const name = window.prompt("Name this sample conversation");
    if (!name?.trim()) return;
    const id = `local-${Date.now()}`;
    const chat: Chat = {
      id,
      name: name.trim().slice(0, 32),
      avatar: name.trim().slice(0, 2).toUpperCase(),
      color: "blue",
      status: "local demo",
      preview: "Start a new conversation",
      unread: 0,
      messages: [],
    };
    setChats((current) => [chat, ...current]);
    setActiveId(id);
    setMobileOpen(false);
  };

  return (
    <main className="chat-app">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark">
            c<span>.</span>
          </div>
          <strong>chatverse</strong>
          <span className="demo-badge">DEMO</span>
        </div>
        <div className="profile-switch">
          <span className="profile-avatar">WI</span>
          <span>
            <strong>Waleed’s workspace</strong>
            <small>Personal space</small>
          </span>
          <button aria-label="Workspace options">⌄</button>
        </div>
        <div className="section-label">
          MESSAGES{" "}
          <button onClick={createChat} aria-label="Create a conversation">
            ＋
          </button>
        </div>
        <label className="chat-search">
          <span>⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
          />
        </label>
        <div className="chat-filters">
          <button className="selected">All messages</button>
          <button onClick={() => setNotice("Unread filter is a visual demo control.")}>
            Unread <span>2</span>
          </button>
        </div>
        <nav className="chat-list" aria-label="Conversations">
          {filtered.map((chat) => (
            <button
              className={`chat-item ${active.id === chat.id ? "active" : ""}`}
              key={chat.id}
              onClick={() => {
                setActiveId(chat.id);
                setMobileOpen(false);
              }}
            >
              <span className={`avatar ${chat.color}`}>
                {chat.avatar}
                {chat.status === "online" && <i />}
              </span>
              <span className="chat-item-copy">
                <span>
                  <strong>{chat.name}</strong>
                  <small>
                    {chat.group ? "◉ " : ""}
                    {chat.status}
                  </small>
                </span>
                <span className="chat-preview">{chat.preview}</span>
              </span>
              {chat.unread > 0 && <b className="unread-count">{chat.unread}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            onClick={() =>
              setNotice("Notification preferences are not connected in this local showcase.")
            }
          >
            ♧ <span>Notifications</span>
            <i className="notification-dot" />
          </button>
          <button onClick={() => setNotice("Settings are represented as a local demo control.")}>
            ⚙ <span>Settings</span>
          </button>
          <div className="sidebar-foot">
            A LOCAL UI CONCEPT <span>v0.1</span>
          </div>
        </div>
      </aside>
      <section className="conversation">
        <header className="conversation-header">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open conversations"
          >
            ☰
          </button>
          <span className={`avatar small ${active.color}`}>
            {active.avatar}
            {active.status === "online" && <i />}
          </span>
          <span className="conversation-person">
            <strong>{active.name}</strong>
            <small>
              {active.status === "online" ? (
                <>
                  <i /> Active now
                </>
              ) : (
                active.status
              )}
            </small>
          </span>
          <div className="header-actions">
            <button
              aria-label="Search this conversation"
              onClick={() => setNotice("Conversation search is available from the sidebar.")}
            >
              ⌕
            </button>
            <button
              aria-label="Call"
              onClick={() => setNotice("Calls are not connected in this local demo.")}
            >
              ♧
            </button>
            <button
              aria-label="More options"
              onClick={() => setNotice("More conversation options are a demo control.")}
            >
              •••
            </button>
          </div>
        </header>
        <div className="conversation-scroll">
          <div className="day-divider">
            <span>TODAY</span>
          </div>
          <div className="encryption-note">
            ♢ &nbsp; Messages in this showcase stay in your browser session.
          </div>
          <div className="message-stack">
            {active.messages.map((message) => (
              <article
                className={`message-row ${message.author === "me" ? "mine" : ""}`}
                key={message.id}
              >
                <span
                  className={`message-avatar ${message.author === "me" ? "self" : active.color}`}
                >
                  {message.author === "me" ? "WI" : active.avatar}
                </span>
                <div className="message-content">
                  <div className="message-meta">
                    <strong>{message.author === "me" ? "You" : active.name}</strong>
                    <time>{message.time}</time>
                  </div>
                  <div className="bubble">{message.text}</div>
                  {message.reactions.length > 0 && (
                    <div className="reaction-list">
                      {message.reactions.map((reaction) => (
                        <button key={reaction} onClick={() => addReaction(message.id, reaction)}>
                          {reaction}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="message-tools">
                    {["👍", "❤️", "✨"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(message.id, emoji)}
                        aria-label={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="typing-row">
            <span className="typing-avatar">{active.avatar}</span>
            <span className="typing-bubble">
              <i />
              <i />
              <i />
            </span>
            <small>Maya is typing…</small>
          </div>
        </div>
        <form className="composer" onSubmit={sendMessage}>
          <div className="composer-box">
            <div className="composer-toolbar">
              <label className="attach-button" title="Attach a local file">
                ＋
                <input
                  type="file"
                  onChange={(event) => handleAttachment(event.currentTarget.files?.[0])}
                />
              </label>
              <button
                type="button"
                onClick={() => setDraft((value) => `${value} 😊`)}
                aria-label="Add emoji"
              >
                ☺
              </button>
              <button
                type="button"
                onClick={() => setNotice("Formatting shortcuts are shown for the UI demo.")}
                aria-label="Formatting options"
              >
                Aa
              </button>
            </div>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={`Message ${active.name}…`}
              rows={2}
              aria-label="Write a message"
            />
            <div className="composer-bottom">
              <span>Enter to send · Shift + Enter for a new line</span>
              <button
                className="send-button"
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send message"
              >
                ↑
              </button>
            </div>
          </div>
        </form>
        <div className="local-disclosure">SIMULATED CONVERSATION · Nothing is sent to a server</div>
        {notice && (
          <div className="toast" role="status">
            {notice}
            <button onClick={() => setNotice("")} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
