import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

// Simple translation dictionary for seed content
const TRANSLATIONS: Record<string, {
  man: string;
  woman: string;
  boy: string;
  girl: string;
  zombie: string;
  robot: string;
}> = {
  Spanish: {
    man: "el hombre",
    woman: "la mujer",
    boy: "el chico",
    girl: "la niña",
    zombie: "el zombie",
    robot: "el robot",
  },
  French: {
    man: "l'homme",
    woman: "la femme",
    boy: "le garçon",
    girl: "la fille",
    zombie: "le zombie",
    robot: "le robot",
  },
  German: {
    man: "der Mann",
    woman: "die Frau",
    boy: "der Junge",
    girl: "das Mädchen",
    zombie: "der Zombie",
    robot: "der Roboter",
  },
  Hindi: {
    man: "पुरुष",
    woman: "महिला",
    boy: "लड़का",
    girl: "लड़की",
    zombie: "ज़ॉम्बी",
    robot: "रोबोट",
  },
  Kannada: {
    man: "ಪುರುಷ",
    woman: "ಮಹಿಳೆ",
    boy: "ಹುಡುಗ",
    girl: "ಹುಡುಗಿ",
    zombie: "ಜಾಂಬಿ",
    robot: "ರೋಬೋಟ್",
  },
  Tamil: {
    man: "ஆண்",
    woman: "பெண்",
    boy: "சிறுவன்",
    girl: "சிறுமி",
    zombie: "சோம்பி",
    robot: "ரோபோ",
  },
};

const getAudio = (
  courseTitle: string,
  key: keyof typeof TRANSLATIONS["Spanish"]
) => {
  // Map course title to public file prefix (e.g., es_boy.mp3)
  const prefixMap: Record<string, string> = {
    Spanish: "es",
    French: "fr",
    German: "de",
    Hindi: "hi",
    Kannada: "kn",
    Tamil: "ta",
  };
  const prefix = prefixMap[courseTitle];
  if (!prefix) return undefined;
  return `/${prefix}_${key}.mp3`;
};

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data
    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
      db.delete(schema.userSubscription),
    ]);

    // Insert courses
    const courses = await db
      .insert(schema.courses)
      .values([
        { title: "Spanish", imageSrc: "/es.svg" },
        { title: "French", imageSrc: "/fr.svg" },
        { title: "German", imageSrc: "/de.svg" },
        { title: "Hindi", imageSrc: "/hi.svg" },
        { title: "Kannada", imageSrc: "/kn.svg" },
        { title: "Tamil", imageSrc: "/ta.svg" },
      ])
      .returning();

    // For each course, insert units
    for (const course of courses) {
      const i18n = TRANSLATIONS[course.title as keyof typeof TRANSLATIONS] ?? TRANSLATIONS.Spanish;

      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unit 1",
            description: `Learn the basics of ${course.title}`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2",
            description: `Learn intermediate ${course.title}`,
            order: 2,
          },
        ])
        .returning();

      // For each unit, insert lessons with slightly different prompts
      for (const unit of units) {
        const lessons = await db
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "People", order: 1 },
            { unitId: unit.id, title: "Characters", order: 2 },
            { unitId: unit.id, title: "Basics", order: 3 },
            { unitId: unit.id, title: "Phrases", order: 4 },
            { unitId: unit.id, title: "Practice", order: 5 },
          ])
          .returning();

        // For each lesson, insert challenges
        for (const lesson of lessons) {
          const challenges = await db
            .insert(schema.challenges)
            .values([
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the man"?',
                order: 1,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the woman"?',
                order: 2,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the boy"?',
                order: 3,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"the man"',
                order: 4,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the zombie"?',
                order: 5,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the robot"?',
                order: 6,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the girl"?',
                order: 7,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"the zombie"',
                order: 8,
              },
            ])
            .returning();

          // For each challenge, insert challenge options using localized text and shared images
          for (const challenge of challenges) {
            if (challenge.order === 1) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: i18n.man,
                  imageSrc: "/man.svg",
                  audioSrc: getAudio(course.title, "man"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.woman,
                  imageSrc: "/woman.svg",
                  audioSrc: getAudio(course.title, "woman"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.boy,
                  imageSrc: "/boy.svg",
                  audioSrc: getAudio(course.title, "boy"),
                },
              ]);
            }

            if (challenge.order === 2) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: i18n.woman,
                  imageSrc: "/woman.svg",
                  audioSrc: getAudio(course.title, "woman"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.boy,
                  imageSrc: "/boy.svg",
                  audioSrc: getAudio(course.title, "boy"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.man,
                  imageSrc: "/man.svg",
                  audioSrc: getAudio(course.title, "man"),
                },
              ]);
            }

            if (challenge.order === 3) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.woman,
                  imageSrc: "/woman.svg",
                  audioSrc: getAudio(course.title, "woman"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.man,
                  imageSrc: "/man.svg",
                  audioSrc: getAudio(course.title, "man"),
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: i18n.boy,
                  imageSrc: "/boy.svg",
                  audioSrc: getAudio(course.title, "boy"),
                },
              ]);
            }

            if (challenge.order === 4) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.woman,
                  audioSrc: getAudio(course.title, "woman"),
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: i18n.man,
                  audioSrc: getAudio(course.title, "man"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.boy,
                  audioSrc: getAudio(course.title, "boy"),
                },
              ]);
            }

            if (challenge.order === 5) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.man,
                  imageSrc: "/man.svg",
                  audioSrc: getAudio(course.title, "man"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.woman,
                  imageSrc: "/woman.svg",
                  audioSrc: getAudio(course.title, "woman"),
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: i18n.zombie,
                  imageSrc: "/zombie.svg",
                  audioSrc: getAudio(course.title, "zombie"),
                },
              ]);
            }

            if (challenge.order === 6) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: i18n.robot,
                  imageSrc: "/robot.svg",
                  audioSrc: getAudio(course.title, "robot"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.zombie,
                  imageSrc: "/zombie.svg",
                  audioSrc: getAudio(course.title, "zombie"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.boy,
                  imageSrc: "/boy.svg",
                  audioSrc: getAudio(course.title, "boy"),
                },
              ]);
            }

            if (challenge.order === 7) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: i18n.girl,
                  imageSrc: "/girl.svg",
                  audioSrc: getAudio(course.title, "girl"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.zombie,
                  imageSrc: "/zombie.svg",
                  audioSrc: getAudio(course.title, "zombie"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.man,
                  imageSrc: "/man.svg",
                  audioSrc: getAudio(course.title, "man"),
                },
              ]);
            }

            if (challenge.order === 8) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.woman,
                  audioSrc: getAudio(course.title, "woman"),
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: i18n.zombie,
                  audioSrc: getAudio(course.title, "zombie"),
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: i18n.boy,
                  audioSrc: getAudio(course.title, "boy"),
                },
              ]);
            }
          }
        }
      }
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();
