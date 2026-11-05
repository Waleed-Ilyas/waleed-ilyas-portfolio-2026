"use client";

import { FormEvent, useMemo, useState } from "react";

type Post = {
  id: number;
  name: string;
  handle: string;
  initials: string;
  color: string;
  time: string;
  body: string;
  topic: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  commentsList: string[];
};
const seed: Post[] = [
  {
    id: 1,
    name: "Maya Chen",
    handle: "mayacreates",
    initials: "MC",
    color: "lavender",
    time: "24 min",
    body: "A small reminder for the middle of a big project: the clearest next step is often more useful than the perfect plan. What’s one thing you made simpler this week?",
    topic: "Creative practice",
    likes: 48,
    comments: 12,
    liked: false,
    saved: false,
    commentsList: [
      "Naming the one decision we need today.",
      "Cutting a screen that didn’t help the flow.",
    ],
  },
  {
    id: 2,
    name: "Leo Park",
    handle: "leopark",
    initials: "LP",
    color: "mint",
    time: "1 hr",
    body: "A few things I learned while making a design system easier to use:\n\n→ Keep examples close to the component\n→ Make the accessible state the default\n→ Document the reason behind the token\n\nWhat helps your team adopt shared patterns?",
    topic: "Design systems",
    likes: 86,
    comments: 19,
    liked: true,
    saved: false,
    commentsList: ["Showing a real page instead of an isolated component."],
  },
  {
    id: 3,
    name: "Amara Okafor",
    handle: "amarao",
    initials: "AO",
    color: "peach",
    time: "3 hrs",
    body: "Today’s field notes: run the smallest test that can prove or disprove your idea. A prototype is most valuable when it helps the team learn something specific.",
    topic: "Product thinking",
    likes: 31,
    comments: 7,
    liked: false,
    saved: true,
    commentsList: [],
  },
];
const sampleUsers = [
  ["Jon Bell", "jonbuilds", "JB", "gold", "Product designer"],
  ["Noor Hussain", "noorcodes", "NH", "blue", "Frontend developer"],
  ["Sofia Ruiz", "sofiaruiz", "SR", "peach", "Research lead"],
  ["Evan Kim", "evanmakes", "EK", "mint", "Indie maker"],
  ["Aisha Rahman", "aishadesigns", "AR", "rose", "Design engineer"],
  ["Mateo Silva", "mateocodes", "MS", "violet", "Backend developer"],
  ["Priya Nair", "priyanair", "PN", "gold", "Technical writer"],
  ["Omar Farooq", "omarf", "OF", "blue", "Accessibility specialist"],
  ["Lena Fischer", "lenaf", "LF", "peach", "Product manager"],
  ["Theo Martin", "theobuilds", "TM", "mint", "Creative technologist"],
];
const additionalPosts: Post[] = (
  [
    [
      "Evan Kim",
      "evanmakes",
      "EK",
      "mint",
      "A useful prototype answers one question clearly. If it tries to answer five, it usually answers none of them well.",
      "Product thinking",
      22,
      4,
    ],
    [
      "Aisha Rahman",
      "aishadesigns",
      "AR",
      "rose",
      "A tiny accessibility win from today: focus rings that are visible on every surface, including the dark ones.",
      "Accessibility",
      37,
      8,
    ],
    [
      "Mateo Silva",
      "mateocodes",
      "MS",
      "violet",
      "The best API error messages I have used explain what happened and give the caller a safe next step.",
      "Engineering",
      19,
      3,
    ],
    [
      "Priya Nair",
      "priyanair",
      "PN",
      "gold",
      "Writing the README while the context is fresh saved me from reconstructing half the setup a week later.",
      "Developer tools",
      41,
      9,
    ],
    [
      "Omar Farooq",
      "omarf",
      "OF",
      "blue",
      "Keyboard testing is a fast way to find places where a visual design forgot to explain how it works.",
      "Accessibility",
      29,
      6,
    ],
    [
      "Lena Fischer",
      "lenaf",
      "LF",
      "peach",
      "A good planning session ends with fewer open questions and a small next action for every owner.",
      "Team practice",
      16,
      2,
    ],
    [
      "Theo Martin",
      "theobuilds",
      "TM",
      "mint",
      "I am keeping a small collection of interface states that surprised me. It is becoming a better reference than my mood board.",
      "Creative practice",
      34,
      7,
    ],
    [
      "Maya Chen",
      "mayacreates",
      "MC",
      "lavender",
      "When the scope feels too broad, I write down the smallest useful version and ask what evidence would change my mind.",
      "Product thinking",
      52,
      11,
    ],
    [
      "Leo Park",
      "leopark",
      "LP",
      "mint",
      "Design tokens are easier to maintain when each one has a reason to exist and an example of where it belongs.",
      "Design systems",
      63,
      14,
    ],
    [
      "Amara Okafor",
      "amarao",
      "AO",
      "peach",
      "A research note is more actionable when it separates what we observed from what we think it means.",
      "Research",
      25,
      5,
    ],
    [
      "Jon Bell",
      "jonbuilds",
      "JB",
      "gold",
      "I am trying shorter design reviews: one decision, one artifact, and enough context to make the feedback useful.",
      "Team practice",
      18,
      3,
    ],
    [
      "Noor Hussain",
      "noorcodes",
      "NH",
      "blue",
      "The component got simpler when I moved the default behavior into the component instead of a setup guide.",
      "Frontend",
      46,
      10,
    ],
    [
      "Sofia Ruiz",
      "sofiaruiz",
      "SR",
      "peach",
      "A useful interview question invites a story about a real moment, not a guess about what someone might do.",
      "Research",
      31,
      6,
    ],
    [
      "Evan Kim",
      "evanmakes",
      "EK",
      "mint",
      "I keep a short decision log for experiments. It makes it easier to notice when an old assumption stops being true.",
      "Product thinking",
      20,
      4,
    ],
    [
      "Aisha Rahman",
      "aishadesigns",
      "AR",
      "rose",
      "Color contrast is part of the interaction. I check it before polishing shadows and gradients.",
      "Accessibility",
      44,
      9,
    ],
    [
      "Mateo Silva",
      "mateocodes",
      "MS",
      "violet",
      "Small, explicit data boundaries make it much easier to test a feature without reaching for production data.",
      "Engineering",
      27,
      5,
    ],
    [
      "Priya Nair",
      "priyanair",
      "PN",
      "gold",
      "A diagram can be a great debugging tool: if I cannot draw the handoff, I probably do not understand it yet.",
      "Developer tools",
      38,
      8,
    ],
  ] as const
).map(([name, handle, initials, color, body, topic, likes, comments], index) => ({
  id: index + 4,
  name,
  handle,
  initials,
  color,
  time: `${index + 1} days`,
  body,
  topic,
  likes,
  comments,
  liked: false,
  saved: false,
  commentsList: [],
}));
const people = sampleUsers.map(([name, handle, initials, color, detail]) => ({
  name,
  handle,
  initials,
  color,
  detail,
}));

export default function SocialSpherePage() {
  const [posts, setPosts] = useState([...seed, ...additionalPosts]);
  const [composer, setComposer] = useState("");
  const [filter, setFilter] = useState("For you");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [commenting, setCommenting] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [followed, setFollowed] = useState<string[]>([]);
  const [story, setStory] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const visible = useMemo(
    () =>
      posts.filter(
        (post) =>
          `${post.name} ${post.handle} ${post.body} ${post.topic}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (filter !== "Saved" || post.saved),
      ),
    [posts, query, filter],
  );
  const updatePost = (id: number, update: (post: Post) => Post) =>
    setPosts((current) => current.map((post) => (post.id === id ? update(post) : post)));
  const publish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = composer.trim();
    if (!body && !fileName) return;
    setPosts((current) => [
      {
        id: Date.now(),
        name: "Waleed Ilyas",
        handle: "you",
        initials: "WI",
        color: "blue",
        time: "now",
        body: body || `Shared an image: ${fileName}`,
        topic: "Community",
        likes: 0,
        comments: 0,
        liked: false,
        saved: false,
        commentsList: [],
      },
      ...current,
    ]);
    if (process.env.NODE_ENV !== "production") {
      void fetch("http://127.0.0.1:4105/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body || `Shared an image: ${fileName}` }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("API request failed");
        })
        .catch(() =>
          setNotice("Post is visible in this browser only. Start the local API to persist it."),
        );
    }
    setComposer("");
    setFileName("");
    setNotice("Post added to this local feed.");
  };
  const addComment = (event: FormEvent<HTMLFormElement>, id: number) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    updatePost(id, (post) => ({
      ...post,
      comments: post.comments + 1,
      commentsList: [...post.commentsList, commentText.trim()],
    }));
    setCommentText("");
    setNotice("Comment added to the local post.");
  };
  const toggleFollow = (handle: string) =>
    setFollowed((current) =>
      current.includes(handle) ? current.filter((item) => item !== handle) : [...current, handle],
    );

  return (
    <main className="social-app">
      <aside className="social-sidebar">
        <a className="social-brand" href="#top">
          <span>◎</span> circles
        </a>
        <div className="space-chip">
          <span className="space-avatar">C</span>
          <span>
            <b>Creative space</b>
            <small>Community demo</small>
          </span>
          <i>⌄</i>
        </div>
        <nav aria-label="Main navigation">
          <button className="active" onClick={() => setFilter("For you")}>
            ⌂ <span>Home feed</span>
          </button>
          <button onClick={() => setNotice("Explore is a local navigation concept.")}>
            ⌕ <span>Explore</span>
          </button>
          <button onClick={() => setNotice("Notifications are sample interface only.")}>
            ♧ <span>Notifications</span>
            <b className="nav-count">3</b>
          </button>
          <button onClick={() => setFilter("Saved")}>
            ▣ <span>Saved posts</span>
          </button>
          <button onClick={() => setNotice("Messages are not connected to a chat service.")}>
            ✉ <span>Messages</span>
          </button>
        </nav>
        <div className="side-caption">YOUR SPACES</div>
        <button
          className="space-link"
          onClick={() => setNotice("Space membership is sample data.")}
        >
          <i className="space-dot violet" /> Product craft
        </button>
        <button
          className="space-link"
          onClick={() => setNotice("Space membership is sample data.")}
        >
          <i className="space-dot green" /> Indie makers
        </button>
        <button
          className="space-link"
          onClick={() => setNotice("Space membership is sample data.")}
        >
          <i className="space-dot orange" /> Design systems
        </button>
        <button
          className="create-space"
          onClick={() => setNotice("Space creation requires a community backend.")}
        >
          ＋ Create a space
        </button>
        <div className="social-profile">
          <span className="person-avatar blue">WI</span>
          <span>
            <b>Waleed Ilyas</b>
            <small>@you · local demo</small>
          </span>
          <button onClick={() => setNotice("Profile settings are not persisted.")}>•••</button>
        </div>
      </aside>
      <section className="social-main" id="top">
        <header className="social-topbar">
          <div>
            <span className="top-title">Community</span>
            <span className="top-subtitle">A place for ideas in progress.</span>
          </div>
          <label className="social-search">
            ⌕
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search posts"
            />
          </label>
          <button
            className="mobile-profile"
            onClick={() => setNotice("You’re viewing the local profile demo.")}
          >
            WI
          </button>
        </header>
        <div className="social-content">
          <div className="stories-row">
            <div className="stories-heading">
              <b>Circles &amp; people</b>
              <button
                onClick={() => setNotice("Stories are sample-only and have no expiry service.")}
              >
                See all
              </button>
            </div>
            <div className="story-list">
              <button className="story-card add-story" onClick={() => setStory("Your story")}>
                <span className="story-avatar add">＋</span>
                <small>Your story</small>
              </button>
              {people.map((person) => (
                <button
                  className="story-card"
                  key={person.handle}
                  onClick={() => setStory(person.name)}
                >
                  <span className={`story-avatar ${person.color}`}>
                    <i>{person.initials}</i>
                  </span>
                  <small>{person.name.split(" ")[0]}</small>
                </button>
              ))}
            </div>
          </div>
          <form className="post-composer" onSubmit={publish}>
            <div className="composer-top">
              <span className="person-avatar blue">WI</span>
              <textarea
                value={composer}
                onChange={(event) => setComposer(event.target.value)}
                placeholder="Share a thought with your circles…"
                rows={2}
                aria-label="Write a post"
              />
            </div>
            {fileName && (
              <div className="file-chip">
                ▧ {fileName}
                <button
                  type="button"
                  onClick={() => setFileName("")}
                  aria-label="Remove attachment"
                >
                  ×
                </button>
              </div>
            )}
            <div className="composer-actions">
              <label className="composer-action">
                ▧ <span>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setFileName(event.currentTarget.files?.[0]?.name ?? "")}
                />
              </label>
              <button
                type="button"
                className="composer-action"
                onClick={() => setComposer((value) => `${value} 😊`)}
              >
                ☺ <span>Feeling</span>
              </button>
              <button
                type="button"
                className="composer-action"
                onClick={() =>
                  setNotice("Audience selection is not connected to account permissions.")
                }
              >
                ◎ <span>Audience</span>
              </button>
              <button
                className="publish-button"
                type="submit"
                disabled={!composer.trim() && !fileName}
              >
                Share
              </button>
            </div>
          </form>
          <div className="feed-toolbar">
            <div>
              <button
                className={filter === "For you" ? "feed-active" : ""}
                onClick={() => setFilter("For you")}
              >
                For you
              </button>
              <button
                className={filter === "Following" ? "feed-active" : ""}
                onClick={() => {
                  setFilter("Following");
                  setNotice("Following feed uses the same sample posts.");
                }}
              >
                Following
              </button>
            </div>
            <button
              className="feed-sort"
              onClick={() => setNotice("Newest sorting is applied in this sample feed.")}
            >
              Recent ↓
            </button>
          </div>
          <div className="feed-list">
            {visible.length ? (
              visible.map((post) => (
                <article className="feed-post" key={post.id}>
                  <div className="post-avatar-wrap">
                    <span className={`person-avatar ${post.color}`}>{post.initials}</span>
                  </div>
                  <div className="post-body">
                    <div className="post-author">
                      <span>
                        <b>{post.name}</b>{" "}
                        <small>
                          @{post.handle} · {post.time}
                        </small>
                      </span>
                      <button
                        onClick={() => setNotice("Post options are a local UI concept.")}
                        aria-label="Post options"
                      >
                        •••
                      </button>
                    </div>
                    <p>{post.body}</p>
                    {post.topic && (
                      <a
                        className="post-topic"
                        href="#topic"
                        onClick={(event) => {
                          event.preventDefault();
                          setQuery(post.topic);
                        }}
                      >
                        #{post.topic.toLowerCase().replaceAll(" ", "")}
                      </a>
                    )}
                    <div className="post-stats">
                      <span>{post.likes} appreciations</span>
                      <button
                        onClick={() => setCommenting(commenting === post.id ? null : post.id)}
                      >
                        {post.comments} comments
                      </button>
                    </div>
                    <div className="post-actions">
                      <button
                        className={post.liked ? "is-liked" : ""}
                        onClick={() =>
                          updatePost(post.id, (item) => ({
                            ...item,
                            liked: !item.liked,
                            likes: item.likes + (item.liked ? -1 : 1),
                          }))
                        }
                      >
                        {post.liked ? "♥" : "♡"} <span>Appreciate</span>
                      </button>
                      <button
                        onClick={() => setCommenting(commenting === post.id ? null : post.id)}
                      >
                        ▢ <span>Comment</span>
                      </button>
                      <button
                        onClick={() => {
                          updatePost(post.id, (item) => ({ ...item, saved: !item.saved }));
                          setNotice(
                            post.saved
                              ? "Post removed from saved."
                              : "Post saved in this local feed.",
                          );
                        }}
                      >
                        ▣ <span>{post.saved ? "Saved" : "Save"}</span>
                      </button>
                      <button
                        onClick={() =>
                          setNotice("Sharing is not connected outside this local page.")
                        }
                      >
                        ↗ <span>Share</span>
                      </button>
                    </div>
                    {commenting === post.id && (
                      <div className="comments-box">
                        {post.commentsList.map((comment, index) => (
                          <p key={`${index}-${comment}`}>
                            <b>{index === 0 ? "Community member" : "You"}</b> {comment}
                          </p>
                        ))}
                        <form onSubmit={(event) => addComment(event, post.id)}>
                          <input
                            value={commentText}
                            onChange={(event) => setCommentText(event.target.value)}
                            placeholder="Write a local comment…"
                            aria-label="Write a comment"
                          />
                          <button type="submit" disabled={!commentText.trim()}>
                            Reply
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-feed">
                No posts match this view. Try another search or share the first post.
              </div>
            )}
          </div>
        </div>
      </section>
      <aside className="right-rail">
        <div className="rail-card">
          <div className="rail-title">
            <span>People to meet</span>
            <button onClick={() => setNotice("Suggestions are fictional sample profiles.")}>
              See all
            </button>
          </div>
          {people.map((person) => (
            <div className="suggestion" key={person.handle}>
              <span className={`person-avatar ${person.color}`}>{person.initials}</span>
              <span>
                <b>{person.name}</b>
                <small>{person.detail}</small>
              </span>
              <button
                className={followed.includes(person.handle) ? "followed" : "follow-button"}
                onClick={() => toggleFollow(person.handle)}
              >
                {followed.includes(person.handle) ? "✓" : "+"}
              </button>
            </div>
          ))}
        </div>
        <div className="rail-card trending">
          <div className="rail-title">
            <span>Topics this week</span>
            <span className="spark">✦</span>
          </div>
          {[
            ["designsystems", "1.2k posts"],
            ["buildinpublic", "864 posts"],
            ["productthinking", "621 posts"],
            ["creativecoding", "403 posts"],
          ].map(([topic, count], i) => (
            <button
              className="trend-row"
              key={topic}
              onClick={() => {
                setQuery(topic.replaceAll(" ", ""));
                setNotice("Filtered posts using this topic keyword.");
              }}
            >
              <small>0{i + 1} · TOPIC</small>
              <b>#{topic}</b>
              <span>{count}</span>
            </button>
          ))}
        </div>
        <div className="rail-foot">
          <span>Local demo · Sample community</span>
          <span>About · Guidelines · Privacy</span>
          <small>SocialSphere showcase · 2026</small>
        </div>
      </aside>
      {notice && (
        <div className="social-toast" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
      {story && (
        <div className="story-modal" role="presentation" onClick={() => setStory(null)}>
          <div role="dialog" aria-modal="true" aria-label={`${story} story`}>
            <button onClick={() => setStory(null)} aria-label="Close story">
              ×
            </button>
            <span className="story-big">◎</span>
            <h2>{story}</h2>
            <p>Story preview concept · sample only</p>
          </div>
        </div>
      )}
    </main>
  );
}
