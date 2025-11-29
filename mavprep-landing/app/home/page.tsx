"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

const SUGGESTIONS = ["CSE 2312", "CSE 3318", "CSE 3310", "CSE 3320"];

const RESOURCES = [
  {
    id: 1,
    course: "CSE 2312",
    title: "CSE 2312 — Data Structures Study Guide",
    excerpt:
      "Comprehensive notes, common pitfalls, and topic-wise practice problems.",
    schedule: "Midterm: Oct 12 | Final: Dec 10",
    postedBy: "instructor_jane",
    viewedBy: 124,
    date: "2025-09-01",
    postId: "post-0001",
  },
  {
    id: 2,
    course: "CSE 3318",
    title: "CSE 3318 — Algorithms Exam Schedule",
    excerpt:
      "Exam blueprint, solved past papers and time-management tips for exams.",
    schedule: "Midterm: Oct 22 | Final: Dec 12",
    postedBy: "prof_smith",
    viewedBy: 89,
    date: "2025-09-03",
    postId: "post-0002",
  },
  {
    id: 3,
    course: "CSE 3310",
    title: "CSE 3310 — Systems Study Pack",
    excerpt: "Lab walkthroughs, cheat sheets, and practice quizzes.",
    schedule: "Midterm: Oct 18 | Final: Dec 14",
    postedBy: "ta_lee",
    viewedBy: 213,
    date: "2025-09-07",
    postId: "post-0003",
  },
  {
    id: 4,
    course: "CSE 3320",
    title: "CSE 3320 — Database Exam Guide",
    excerpt: "ER design examples, normalization exercises, query challenges.",
    schedule: "Midterm: Oct 28 | Final: Dec 16",
    postedBy: "prof_khan",
    viewedBy: 58,
    date: "2025-09-10",
    postId: "post-0004",
  },
  {
    id: 5,
    course: "CSE 2312",
    title: "CSE 2312 — Practice Exam Set A",
    excerpt: "Timed practice exams with solutions and answer walkthrough.",
    schedule: "Practice: Weekly",
    postedBy: "student_ali",
    viewedBy: 44,
    date: "2025-09-12",
    postId: "post-0005",
  },
  {
    id: 6,
    course: "CSE 3318",
    title: "CSE 3318 — Cheat Sheets",
    excerpt: "One-page summaries for quick last-minute revision.",
    schedule: "N/A",
    postedBy: "student_lee",
    viewedBy: 32,
    date: "2025-09-15",
    postId: "post-0006",
  },
  {
    id: 7,
    course: "GENERAL",
    title: "Fall 2025 — Master Exam Schedule (UTA)",
    excerpt:
      "Official fall 2025 master exam schedule (PDF) — University of Texas at Arlington.",
    schedule: "Published: Fall 2025",
    link: "https://cdn.prod.web.uta.edu/-/media/project/website/administration/registrar/documents/exam-schedules/fall2025-master.pdf",
    postedBy: "registrar_office",
    viewedBy: 402,
    date: "2025-08-20",
    postId: "post-0007",
  },
];

export default function HomePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESOURCES;
    return RESOURCES.filter(
      (r) =>
        r.course.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.excerpt.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold neon-text-glow">MavPrep</h1>
          </div>

          <div className="mt-6">
            <div className="flex gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a course (e.g. CSE 2312)"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={() => setQuery("")}
                className="px-4 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="text-xs px-3 py-1 bg-gray-900/60 border border-gray-700 rounded-full text-gray-200 hover:border-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main>
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Study Guides & Exam Schedules
            </h2>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map((item) => (
                <Link
                  key={item.postId ?? item.id}
                  href={`/post/${item.postId ?? item.id}`}
                  className="no-underline block"
                >
                  <article className="break-inside-avoid p-6 mb-4 bg-gradient-to-br from-gray-900/60 to-black border border-gray-800 rounded-2xl shadow-neon hover:scale-[1.01] transition-transform">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold p-2 text-center whitespace-normal break-words">
                        {item.course}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-gray-300 mt-1">
                          {item.excerpt}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <p className="text-xs text-gray-400">
                            {item.schedule}
                          </p>
                          {item.link ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  item.link,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }}
                              className="text-xs text-primary hover:underline"
                            >
                              View
                            </button>
                          ) : null}
                        </div>

                        <div className="mt-2 text-xs text-gray-400 flex items-center gap-3">
                          <span>
                            Posted by:{" "}
                            <span className="text-gray-200">
                              {item.postedBy}
                            </span>
                          </span>
                          <span>
                            Viewed by:{" "}
                            <span className="text-gray-200">
                              {item.viewedBy}
                            </span>
                          </span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
