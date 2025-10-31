import Link from "next/link";
import Resources from "../components/Resources";

export default function Home() {
  return (
    <main className="flex-1">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">MavPrep</h1>
          <div className="space-x-4">
            <Link href="#features" className="text-gray-700 hover:text-black">
              Features
            </Link>
            <Link href="#how" className="text-gray-700 hover:text-black">
              How it works
            </Link>
            <Link href="#join" className="text-gray-700 hover:text-black">
              Join
            </Link>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold">
          MavPrep: Prep. Practice. Get In.
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          A hub for UTA/ACM style prep — practice problems, interview questions,
          and course helpers.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#features"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow hover:bg-indigo-700"
          >
            Explore Features
          </a>
          <a
            href="#join"
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-50"
          >
            Join Discord
          </a>
        </div>
      </section>

      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-semibold mb-6">Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg shadow-sm">
              <h4 className="text-lg font-bold">ACM style problems</h4>
              <p className="mt-2 text-gray-600">
                Timed problems and judge-style feedback to prepare for ICPC/ACM
                competitions.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h4 className="text-lg font-bold">Interview prep</h4>
              <p className="mt-2 text-gray-600">
                Common interview patterns, coding exercises, and mock
                interviews.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h4 className="text-lg font-bold">CS class helpers</h4>
              <p className="mt-2 text-gray-600">
                Notes, sample problems, and reference guides for core CS
                classes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="container mx-auto px-6 py-16">
        <h3 className="text-2xl font-semibold mb-4">How it works</h3>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Find problems by category or difficulty.</li>
          <li>Practice with time limits and auto-checking.</li>
          <li>Join study groups and track progress.</li>
        </ol>
      </section>

      <section id="join" className="bg-indigo-50 py-14">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold">Join the community</h3>
          <p className="mt-2 text-gray-700">
            Connect on Discord to find study partners and get help.
          </p>
          <div className="mt-6">
            <a
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
              href="https://discord.gg/"
              target="_blank"
              rel="noreferrer"
            >
              Join the Discord
            </a>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10">
        <h3 className="text-xl font-semibold">
          Example backend resources (demo)
        </h3>
        <Resources />
      </section>

      <footer className="bg-white mt-auto border-t">
        <div className="container mx-auto px-6 py-6 text-center text-gray-600">
          © {new Date().getFullYear()} MavPrep — Built for practice and success.
        </div>
      </footer>
    </main>
  );
}
