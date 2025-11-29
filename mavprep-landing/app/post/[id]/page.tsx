import Link from "next/link";

const RESOURCES = [
  {
    postId: "post-0001",
    id: 1,
    course: "CSE 2312",
    title: "CSE 2312 — Data Structures Study Guide",
    excerpt:
      "Comprehensive notes, common pitfalls, and topic-wise practice problems.",
    schedule: "Midterm: Oct 12 | Final: Dec 10",
    postedBy: "instructor_jane",
    viewedBy: 124,
    date: "2025-09-01",
  },
  {
    postId: "post-0002",
    id: 2,
    course: "CSE 3318",
    title: "CSE 3318 — Algorithms Exam Schedule",
    excerpt:
      "Exam blueprint, solved past papers and time-management tips for exams.",
    schedule: "Midterm: Oct 22 | Final: Dec 12",
    postedBy: "prof_smith",
    viewedBy: 89,
    date: "2025-09-03",
  },
  {
    postId: "post-0003",
    id: 3,
    course: "CSE 3310",
    title: "CSE 3310 — Systems Study Pack",
    excerpt: "Lab walkthroughs, cheat sheets, and practice quizzes.",
    schedule: "Midterm: Oct 18 | Final: Dec 14",
    postedBy: "ta_lee",
    viewedBy: 213,
    date: "2025-09-07",
  },
  {
    postId: "post-0004",
    id: 4,
    course: "CSE 3320",
    title: "CSE 3320 — Database Exam Guide",
    excerpt: "ER design examples, normalization exercises, query challenges.",
    schedule: "Midterm: Oct 28 | Final: Dec 16",
    postedBy: "prof_khan",
    viewedBy: 58,
    date: "2025-09-10",
  },
  {
    postId: "post-0005",
    id: 5,
    course: "CSE 2312",
    title: "CSE 2312 — Practice Exam Set A",
    excerpt: "Timed practice exams with solutions and answer walkthrough.",
    schedule: "Practice: Weekly",
    postedBy: "student_ali",
    viewedBy: 44,
    date: "2025-09-12",
  },
  {
    postId: "post-0006",
    id: 6,
    course: "CSE 3318",
    title: "CSE 3318 — Cheat Sheets",
    excerpt: "One-page summaries for quick last-minute revision.",
    schedule: "N/A",
    postedBy: "student_lee",
    viewedBy: 32,
    date: "2025-09-15",
  },
  {
    postId: "post-0007",
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
  },
];

export default function PostPage({ params }: { params: { id: string } }) {
  const idParam = params.id;
  // support both numeric id and string postId (e.g. "post-0003")
  const post = RESOURCES.find(
    (r) => r.postId === idParam || String(r.id) === idParam
  );

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Post not found</h2>
          <Link href="/home" className="text-sm text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/home" className="text-sm text-gray-400 hover:text-primary">
          ← Back
        </Link>

        <header className="mt-6">
          <div className="text-3xl font-bold neon-text-glow">{post.title}</div>
          <div className="mt-3 text-sm text-gray-400">
            Posted by: <span className="text-gray-200">{post.postedBy}</span>
            <span className="mx-2">•</span>
            Viewed by: <span className="text-gray-200">{post.viewedBy}</span>
            <span className="mx-2">•</span>
            <span>{post.date}</span>
          </div>
        </header>

        <main className="mt-6">
          <p className="text-sm text-gray-300">{post.excerpt}</p>

          <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-sm">Schedule: {post.schedule}</p>
            {post.link ? (
              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-primary hover:underline text-sm"
              >
                Open resource
              </a>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
