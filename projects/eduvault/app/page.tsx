"use client";

import { FormEvent, useMemo, useState } from "react";

type Course = {
  id: string;
  title: string;
  teacher: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  progress: number;
  art: string;
  accent: string;
  enrolled: boolean;
};
const seed: Course[] = [
  {
    id: "react",
    title: "Interfaces that feel effortless",
    teacher: "Avery Morgan",
    category: "Design",
    level: "Intermediate",
    duration: "4h 20m",
    lessons: 18,
    progress: 62,
    art: "◉",
    accent: "violet",
    enrolled: true,
  },
  {
    id: "systems",
    title: "Systems thinking for product teams",
    teacher: "Nadia Rahman",
    category: "Product",
    level: "Beginner",
    duration: "3h 10m",
    lessons: 14,
    progress: 28,
    art: "⌘",
    accent: "mint",
    enrolled: true,
  },
  {
    id: "typescript",
    title: "TypeScript beyond the basics",
    teacher: "Jordan Lee",
    category: "Development",
    level: "Advanced",
    duration: "5h 45m",
    lessons: 22,
    progress: 0,
    art: "TS",
    accent: "blue",
    enrolled: false,
  },
  {
    id: "writing",
    title: "Writing for thoughtful products",
    teacher: "Ibrahim Ali",
    category: "Product",
    level: "Beginner",
    duration: "2h 35m",
    lessons: 11,
    progress: 0,
    art: "Aa",
    accent: "peach",
    enrolled: false,
  },
  {
    id: "motion",
    title: "Motion that explains, not distracts",
    teacher: "Sofia Reyes",
    category: "Design",
    level: "Intermediate",
    duration: "3h 50m",
    lessons: 16,
    progress: 0,
    art: "↝",
    accent: "gold",
    enrolled: false,
  },
  {
    id: "testing",
    title: "Reliable front-end testing",
    teacher: "Kai Thompson",
    category: "Development",
    level: "Intermediate",
    duration: "4h 5m",
    lessons: 20,
    progress: 0,
    art: "✓",
    accent: "rose",
    enrolled: false,
  },
];

export default function EduVaultPage() {
  const [courses, setCourses] = useState(seed);
  const [tab, setTab] = useState("My learning");
  const [category, setCategory] = useState("All topics");
  const [search, setSearch] = useState("");
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const visibleCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          (tab === "My learning" ? course.enrolled : !course.enrolled) &&
          (category === "All topics" || course.category === category) &&
          `${course.title} ${course.teacher} ${course.category}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [courses, tab, category, search],
  );
  const enroll = (id: string) => {
    const course = courses.find((item) => item.id === id);
    if (!course) return;
    if (process.env.NODE_ENV !== "production") {
      void fetch("http://127.0.0.1:4106/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("API request failed");
        })
        .catch(() =>
          setNotice("Added for this browser only. Start the local API to persist enrollment."),
        );
    }
    setCourses((current) =>
      current.map((item) => (item.id === id ? { ...item, enrolled: true } : item)),
    );
    setTab("My learning");
    setNotice(`Added “${course.title}” to your local learning list.`);
  };
  const completeLesson = (id: string) =>
    setCourses((current) =>
      current.map((course) =>
        course.id === id ? { ...course, progress: Math.min(course.progress + 7, 100) } : course,
      ),
    );
  const submitQuiz = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuizOpen(false);
    setNotice(
      answer === "scope"
        ? "Correct. The lesson is marked complete in local state."
        : "Quiz submitted. Review the sample lesson and try again.",
    );
    if (answer === "scope" && activeCourse) completeLesson(activeCourse.id);
    setAnswer("");
  };

  return (
    <main className="edu-app">
      <aside className="edu-sidebar">
        <a className="edu-brand" href="#home">
          <span>e</span> eduvault <small>LEARNER</small>
        </a>
        <div className="learner-card">
          <span className="learner-avatar">WI</span>
          <span>
            <b>Waleed’s learning</b>
            <small>Personal dashboard</small>
          </span>
          <i>⌄</i>
        </div>
        <div className="edu-nav-label">LEARNING</div>
        <nav>
          <button
            className="nav-current"
            onClick={() => {
              setTab("My learning");
              setActiveCourse(null);
            }}
          >
            ▦ <span>My learning</span>
          </button>
          <button
            onClick={() => {
              setTab("Explore");
              setActiveCourse(null);
            }}
          >
            ⌕ <span>Explore courses</span>
          </button>
          <button onClick={() => setNotice("Your study plan is a sample interface concept.")}>
            ◷ <span>Study plan</span>
          </button>
          <button
            onClick={() => setNotice("Achievements are not persisted or issued by a server.")}
          >
            ♢ <span>Achievements</span>
          </button>
        </nav>
        <div className="edu-nav-label second">YOUR COLLECTIONS</div>
        <button
          className="collection-link"
          onClick={() => {
            setCategory("Design");
            setTab("Explore");
            setActiveCourse(null);
          }}
        >
          <i className="collection-dot purple" /> Design foundations
        </button>
        <button
          className="collection-link"
          onClick={() => {
            setCategory("Development");
            setTab("Explore");
            setActiveCourse(null);
          }}
        >
          <i className="collection-dot blue-dot" /> Front-end craft
        </button>
        <button
          className="collection-link"
          onClick={() => setNotice("Collection management is a demo control.")}
        >
          ＋ Create collection
        </button>
        <div className="edu-side-bottom">
          <button onClick={() => setNotice("Support links are not connected.")}>
            ⓘ Help center
          </button>
          <span>EDUVAULT SHOWCASE · LOCAL</span>
        </div>
      </aside>
      <section className="edu-main" id="home">
        <header className="edu-topbar">
          <div>
            <span className="greeting">Good morning, Waleed</span>
            <small>A little progress adds up.</small>
          </div>
          <label className="edu-search">
            ⌕{" "}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your learning"
            />
          </label>
          <button
            className="edu-bell"
            onClick={() => setNotice("No live notifications are connected.")}
            aria-label="Notifications"
          >
            ♧<i />
          </button>
          <span className="top-learner">WI</span>
        </header>
        {activeCourse ? (
          <section className="course-detail">
            <button className="back-link" onClick={() => setActiveCourse(null)}>
              ← Back to courses
            </button>
            <div className={`course-detail-art art-${activeCourse.accent}`}>
              <span>{activeCourse.art}</span>
              <small>COURSE PREVIEW · {activeCourse.category.toUpperCase()}</small>
            </div>
            <div className="course-detail-copy">
              <div className="course-tags">
                <span>{activeCourse.category}</span>
                <span>{activeCourse.level}</span>
                <span>{activeCourse.duration}</span>
              </div>
              <h1>{activeCourse.title}</h1>
              <p>
                A practical sample course with concise lessons and project-based exercises to help
                you build confidence one concept at a time.
              </p>
              <div className="teacher-line">
                <span className="teacher-avatar">
                  {activeCourse.teacher
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span>
                  <small>INSTRUCTOR</small>
                  <b>{activeCourse.teacher}</b>
                </span>
              </div>
              <div className="detail-progress">
                <span>Your sample progress</span>
                <b>{activeCourse.progress}%</b>
                <i>
                  <em style={{ width: `${activeCourse.progress}%` }} />
                </i>
              </div>
              <div className="lesson-row">
                <span>
                  <b>01</b>
                  <span>
                    <strong>Start with the question</strong>
                    <small>12 min · Video lesson preview</small>
                  </span>
                </span>
                <button onClick={() => setQuizOpen(true)}>
                  {activeCourse.progress > 0 ? "Continue lesson →" : "Start lesson →"}
                </button>
              </div>
              <p className="course-note">
                Video player, course assets, and certificates are not connected in this local
                preview.
              </p>
            </div>
          </section>
        ) : (
          <>
            <section className="edu-hero">
              <div>
                <span className="edu-overline">YOUR LEARNING, AT YOUR PACE</span>
                <h1>
                  Curiosity is a<br />
                  <em>practice.</em>
                </h1>
                <p>
                  Make space for a new idea. Continue where you left off, or find a course that
                  sparks a question.
                </p>
                <button
                  onClick={() => {
                    setTab("Explore");
                    setCategory("All topics");
                  }}
                >
                  Find your next course <span>↗</span>
                </button>
              </div>
              <div className="hero-stack">
                <div className="stack-orbit orbit1" />
                <div className="stack-orbit orbit2" />
                <div className="stack-core">
                  EV<span>✳</span>
                </div>
                <span className="stack-label label-one">LEARN / 01</span>
                <span className="stack-label label-two">A LITTLE EACH DAY</span>
              </div>
            </section>
            <section className="learning-summary">
              <div>
                <span className="summary-icon">◷</span>
                <span>
                  <b>2 courses in progress</b>
                  <small>Pick up where you paused.</small>
                </span>
              </div>
              <div>
                <span className="summary-icon green-icon">✓</span>
                <span>
                  <b>3h 25m learned</b>
                  <small>This week · sample data</small>
                </span>
              </div>
              <div>
                <span className="summary-icon amber-icon">✦</span>
                <span>
                  <b>4 day streak</b>
                  <small>Keep your rhythm going.</small>
                </span>
              </div>
            </section>
          </>
        )}
        <section className="course-section">
          <div className="course-heading">
            <div>
              <span className="edu-overline">
                {activeCourse ? "KEEP EXPLORING" : "YOUR LIBRARY"}
              </span>
              <h2>
                {activeCourse
                  ? "More to learn"
                  : tab === "My learning"
                    ? "Continue learning"
                    : "Explore courses"}
              </h2>
            </div>
            <button
              className="all-courses"
              onClick={() => {
                setTab(tab === "Explore" ? "My learning" : "Explore");
                setActiveCourse(null);
                setCategory("All topics");
              }}
            >
              {tab === "Explore" ? "My learning" : "Browse all courses"} →
            </button>
          </div>
          <div className="course-filters">
            {["All topics", "Design", "Development", "Product"].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={category === item ? "filter-selected" : ""}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="course-grid">
            {visibleCourses.map((course) => (
              <article className="course-card" key={course.id}>
                <button
                  className={`course-art art-${course.accent}`}
                  onClick={() => setActiveCourse(course)}
                  aria-label={`Preview ${course.title}`}
                >
                  <span>{course.art}</span>
                  <small>FIELD COURSE · {course.category.toUpperCase()}</small>
                </button>
                <div className="course-card-copy">
                  <div className="course-card-meta">
                    <span>{course.category}</span>
                    <span>{course.level}</span>
                  </div>
                  <button className="course-title" onClick={() => setActiveCourse(course)}>
                    {course.title}
                  </button>
                  <p>with {course.teacher}</p>
                  <div className="course-stats">
                    <span>◷ {course.duration}</span>
                    <span>▤ {course.lessons} lessons</span>
                  </div>
                  {course.enrolled ? (
                    <div className="progress-row">
                      <i>
                        <em style={{ width: `${course.progress}%` }} />
                      </i>
                      <small>{course.progress}% complete</small>
                    </div>
                  ) : (
                    <button className="enroll-button" onClick={() => enroll(course.id)}>
                      Add to learning list <span>＋</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
          {visibleCourses.length === 0 && (
            <div className="no-courses">No courses in this view. Try another topic or search.</div>
          )}
        </section>
        <footer className="edu-footer">
          Sample course catalog · This learning progress lives only in this browser.
        </footer>
      </section>
      {notice && (
        <div className="edu-toast" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
      {quizOpen && (
        <div className="quiz-backdrop">
          <form className="quiz-card" onSubmit={submitQuiz}>
            <button
              type="button"
              className="quiz-close"
              onClick={() => setQuizOpen(false)}
              aria-label="Close quiz"
            >
              ×
            </button>
            <span className="edu-overline">QUICK CHECK · LOCAL PREVIEW</span>
            <h2>What makes a useful first prototype?</h2>
            <p>Choose the answer that best matches the lesson.</p>
            {[
              ["scope", "A focused question you can learn from"],
              ["polish", "A complete visual system"],
              ["features", "Every feature on the roadmap"],
            ].map(([value, label]) => (
              <label className={`quiz-option ${answer === value ? "chosen" : ""}`} key={value}>
                <input
                  type="radio"
                  name="answer"
                  value={value}
                  checked={answer === value}
                  onChange={() => setAnswer(value)}
                />
                <span>{label}</span>
              </label>
            ))}
            <button className="quiz-submit" type="submit" disabled={!answer}>
              Check answer
            </button>
            <small>Your answer is not sent to a learning service.</small>
          </form>
        </div>
      )}
    </main>
  );
}
