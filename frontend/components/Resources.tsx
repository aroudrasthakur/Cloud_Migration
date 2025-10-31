"use client";

import { useEffect, useState } from "react";

type Resource = {
  id: number;
  title: string;
  type: string;
  link?: string;
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    fetch(`${base}/api/resources`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => {
        setResources(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-600">Loading resources...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!resources || resources.length === 0)
    return <div className="text-gray-600">No resources found.</div>;

  return (
    <ul className="mt-4 grid md:grid-cols-3 gap-4">
      {resources.map((r) => (
        <li key={r.id} className="p-4 border rounded">
          <h4 className="font-semibold">{r.title}</h4>
          <p className="text-sm text-gray-600">{r.type}</p>
          {r.link && (
            <a
              className="text-indigo-600 text-sm"
              href={r.link}
              target="_blank"
              rel="noreferrer"
            >
              Open
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
