import Link from "next/link";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Button } from "@/components/ui/button";
import { getCourseById, getUserProgress } from "@/db/queries";

const LessonCatalog = async () => {
  const userProgress = await getUserProgress();
  if (!userProgress?.activeCourseId) {
    return (
      <div className="p-6">
        <p>No active course found.</p>
        <Link href="/courses">
          <Button className="mt-4" variant="primary">Choose a language</Button>
        </Link>
      </div>
    );
  }

  const course = await getCourseById(userProgress.activeCourseId);
  if (!course) {
    return (
      <div className="p-6">
        <p>Course not found.</p>
      </div>
    );
  }

  const lessonRows = course.units.flatMap((u) => (
    u.lessons.map((l) => ({
      unit: u.title,
      id: l.id,
      title: l.title,
    }))
  ));

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-2 text-lg font-semibold">Tips</h2>
          <p className="text-sm text-neutral-600">Use the Pronunciation tool to practice each lesson's key terms and get a score out of 10.</p>
          <Link href="/pronunciation">
            <Button size="sm" className="mt-3 rounded-xl" variant="secondary">Open Pronunciation</Button>
          </Link>
        </div>
      </StickyWrapper>
      <FeedWrapper>
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-neutral-900">{course.title} Lessons</h1>
          <p className="text-neutral-600">Browse all topics for this module. Click a lesson to start learning.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {lessonRows.map((row) => (
            <Link key={row.id} href={`/lesson/${row.id}`}>
              <div className="group rounded-2xl border bg-white p-4 transition hover:shadow-md">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">{row.unit}</div>
                <div className="text-lg font-bold text-neutral-800">{row.title}</div>
                <div className="mt-2 text-sm text-neutral-500">Includes audio prompts to teach pronunciation.</div>
                <div className="mt-3 text-xs text-neutral-400">Click to open</div>
              </div>
            </Link>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LessonCatalog;
