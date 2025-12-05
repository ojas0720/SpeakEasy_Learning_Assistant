import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Enhanced translation dictionary with more vocabulary
const TRANSLATIONS: Record<string, Record<string, string>> = {
    Spanish: {
        // People
        man: "el hombre",
        woman: "la mujer",
        boy: "el chico",
        girl: "la niña",
        // Characters
        zombie: "el zombie",
        robot: "el robot",
        cat: "el gato",
        dog: "el perro",
        // Basics
        hello: "hola",
        goodbye: "adiós",
        yes: "sí",
        no: "no",
        please: "por favor",
        thanks: "gracias",
        // Phrases
        goodMorning: "buenos días",
        goodNight: "buenas noches",
        howAreYou: "¿cómo estás?",
        myNameIs: "me llamo",
        // Practice
        water: "agua",
        food: "comida",
        house: "casa",
        book: "libro",
    },
    French: {
        man: "l'homme",
        woman: "la femme",
        boy: "le garçon",
        girl: "la fille",
        zombie: "le zombie",
        robot: "le robot",
        cat: "le chat",
        dog: "le chien",
        hello: "bonjour",
        goodbye: "au revoir",
        yes: "oui",
        no: "non",
        please: "s'il vous plaît",
        thanks: "merci",
        goodMorning: "bonjour",
        goodNight: "bonne nuit",
        howAreYou: "comment allez-vous?",
        myNameIs: "je m'appelle",
        water: "eau",
        food: "nourriture",
        house: "maison",
        book: "livre",
    },
    German: {
        man: "der Mann",
        woman: "die Frau",
        boy: "der Junge",
        girl: "das Mädchen",
        zombie: "der Zombie",
        robot: "der Roboter",
        cat: "die Katze",
        dog: "der Hund",
        hello: "hallo",
        goodbye: "auf Wiedersehen",
        yes: "ja",
        no: "nein",
        please: "bitte",
        thanks: "danke",
        goodMorning: "guten Morgen",
        goodNight: "gute Nacht",
        howAreYou: "wie geht es dir?",
        myNameIs: "ich heiße",
        water: "Wasser",
        food: "Essen",
        house: "Haus",
        book: "Buch",
    },
    Hindi: {
        man: "पुरुष",
        woman: "महिला",
        boy: "लड़का",
        girl: "लड़की",
        zombie: "ज़ॉम्बी",
        robot: "रोबोट",
        cat: "बिल्ली",
        dog: "कुत्ता",
        hello: "नमस्ते",
        goodbye: "अलविदा",
        yes: "हाँ",
        no: "नहीं",
        please: "कृपया",
        thanks: "धन्यवाद",
        goodMorning: "सुप्रभात",
        goodNight: "शुभ रात्रि",
        howAreYou: "आप कैसे हैं?",
        myNameIs: "मेरा नाम है",
        water: "पानी",
        food: "खाना",
        house: "घर",
        book: "किताब",
    },
    Kannada: {
        man: "ಪುರುಷ",
        woman: "ಮಹಿಳೆ",
        boy: "ಹುಡುಗ",
        girl: "ಹುಡುಗಿ",
        zombie: "ಜಾಂಬಿ",
        robot: "ರೋಬೋಟ್",
        cat: "ಬೆಕ್ಕು",
        dog: "ನಾಯಿ",
        hello: "ನಮಸ್ಕಾರ",
        goodbye: "ವಿದಾಯ",
        yes: "ಹೌದು",
        no: "ಇಲ್ಲ",
        please: "ದಯವಿಟ್ಟು",
        thanks: "ಧನ್ಯವಾದ",
        goodMorning: "ಶುಭೋದಯ",
        goodNight: "ಶುಭ ರಾತ್ರಿ",
        howAreYou: "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        myNameIs: "ನನ್ನ ಹೆಸರು",
        water: "ನೀರು",
        food: "ಆಹಾರ",
        house: "ಮನೆ",
        book: "ಪುಸ್ತಕ",
    },
    Tamil: {
        man: "ஆண்",
        woman: "பெண்",
        boy: "சிறுவன்",
        girl: "சிறுமி",
        zombie: "சோம்பி",
        robot: "ரோபோ",
        cat: "பூனை",
        dog: "நாய்",
        hello: "வணக்கம்",
        goodbye: "பிரியாவிடை",
        yes: "ஆம்",
        no: "இல்லை",
        please: "தயவுசெய்து",
        thanks: "நன்றி",
        goodMorning: "காலை வணக்கம்",
        goodNight: "இனிய இரவு",
        howAreYou: "எப்படி இருக்கிறீர்கள்?",
        myNameIs: "என் பெயர்",
        water: "தண்ணீர்",
        food: "உணவு",
        house: "வீடு",
        book: "புத்தகம்",
    },
};

const getAudio = (courseTitle: string, key: string) => {
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

// Lesson-specific challenge configurations
const getLessonChallenges = (lessonTitle: string, i18n: Record<string, string>, courseTitle: string) => {
    switch (lessonTitle) {
        case "People":
            return [
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "the man"?',
                    order: 1,
                    options: [
                        { correct: true, text: i18n.man, imageSrc: "/man.svg", audioSrc: getAudio(courseTitle, "man") },
                        { correct: false, text: i18n.woman, imageSrc: "/woman.svg", audioSrc: getAudio(courseTitle, "woman") },
                        { correct: false, text: i18n.boy, imageSrc: "/boy.svg", audioSrc: getAudio(courseTitle, "boy") },
                    ],
                },
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "the woman"?',
                    order: 2,
                    options: [
                        { correct: true, text: i18n.woman, imageSrc: "/woman.svg", audioSrc: getAudio(courseTitle, "woman") },
                        { correct: false, text: i18n.boy, imageSrc: "/boy.svg", audioSrc: getAudio(courseTitle, "boy") },
                        { correct: false, text: i18n.man, imageSrc: "/man.svg", audioSrc: getAudio(courseTitle, "man") },
                    ],
                },
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "the boy"?',
                    order: 3,
                    options: [
                        { correct: false, text: i18n.woman, imageSrc: "/woman.svg", audioSrc: getAudio(courseTitle, "woman") },
                        { correct: false, text: i18n.man, imageSrc: "/man.svg", audioSrc: getAudio(courseTitle, "man") },
                        { correct: true, text: i18n.boy, imageSrc: "/boy.svg", audioSrc: getAudio(courseTitle, "boy") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"the man"',
                    order: 4,
                    options: [
                        { correct: false, text: i18n.woman, audioSrc: getAudio(courseTitle, "woman") },
                        { correct: true, text: i18n.man, audioSrc: getAudio(courseTitle, "man") },
                        { correct: false, text: i18n.boy, audioSrc: getAudio(courseTitle, "boy") },
                    ],
                },
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "the girl"?',
                    order: 5,
                    options: [
                        { correct: true, text: i18n.girl, imageSrc: "/girl.svg", audioSrc: getAudio(courseTitle, "girl") },
                        { correct: false, text: i18n.boy, imageSrc: "/boy.svg", audioSrc: getAudio(courseTitle, "boy") },
                        { correct: false, text: i18n.woman, imageSrc: "/woman.svg", audioSrc: getAudio(courseTitle, "woman") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"the woman"',
                    order: 6,
                    options: [
                        { correct: true, text: i18n.woman, audioSrc: getAudio(courseTitle, "woman") },
                        { correct: false, text: i18n.girl, audioSrc: getAudio(courseTitle, "girl") },
                        { correct: false, text: i18n.man, audioSrc: getAudio(courseTitle, "man") },
                    ],
                },
            ];

        case "Characters":
            return [
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "the zombie"?',
                    order: 1,
                    options: [
                        { correct: false, text: i18n.man, imageSrc: "/man.svg", audioSrc: getAudio(courseTitle, "man") },
                        { correct: false, text: i18n.robot, imageSrc: "/robot.svg", audioSrc: getAudio(courseTitle, "robot") },
                        { correct: true, text: i18n.zombie, imageSrc: "/zombie.svg", audioSrc: getAudio(courseTitle, "zombie") },
                    ],
                },
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "the robot"?',
                    order: 2,
                    options: [
                        { correct: true, text: i18n.robot, imageSrc: "/robot.svg", audioSrc: getAudio(courseTitle, "robot") },
                        { correct: false, text: i18n.zombie, imageSrc: "/zombie.svg", audioSrc: getAudio(courseTitle, "zombie") },
                        { correct: false, text: i18n.boy, imageSrc: "/boy.svg", audioSrc: getAudio(courseTitle, "boy") },
                    ],
                },
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "the cat"?',
                    order: 3,
                    options: [
                        { correct: false, text: i18n.dog, imageSrc: "/dog.svg", audioSrc: getAudio(courseTitle, "dog") },
                        { correct: true, text: i18n.cat, imageSrc: "/cat.svg", audioSrc: getAudio(courseTitle, "cat") },
                        { correct: false, text: i18n.robot, imageSrc: "/robot.svg", audioSrc: getAudio(courseTitle, "robot") },
                    ],
                },
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "the dog"?',
                    order: 4,
                    options: [
                        { correct: true, text: i18n.dog, imageSrc: "/dog.svg", audioSrc: getAudio(courseTitle, "dog") },
                        { correct: false, text: i18n.cat, imageSrc: "/cat.svg", audioSrc: getAudio(courseTitle, "cat") },
                        { correct: false, text: i18n.zombie, imageSrc: "/zombie.svg", audioSrc: getAudio(courseTitle, "zombie") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"the zombie"',
                    order: 5,
                    options: [
                        { correct: false, text: i18n.robot, audioSrc: getAudio(courseTitle, "robot") },
                        { correct: true, text: i18n.zombie, audioSrc: getAudio(courseTitle, "zombie") },
                        { correct: false, text: i18n.cat, audioSrc: getAudio(courseTitle, "cat") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"the robot"',
                    order: 6,
                    options: [
                        { correct: true, text: i18n.robot, audioSrc: getAudio(courseTitle, "robot") },
                        { correct: false, text: i18n.zombie, audioSrc: getAudio(courseTitle, "zombie") },
                        { correct: false, text: i18n.dog, audioSrc: getAudio(courseTitle, "dog") },
                    ],
                },
            ];

        case "Basics":
            return [
                {
                    type: "ASSIST" as const,
                    question: '"hello"',
                    order: 1,
                    options: [
                        { correct: true, text: i18n.hello, audioSrc: getAudio(courseTitle, "hello") },
                        { correct: false, text: i18n.goodbye, audioSrc: getAudio(courseTitle, "goodbye") },
                        { correct: false, text: i18n.thanks, audioSrc: getAudio(courseTitle, "thanks") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"goodbye"',
                    order: 2,
                    options: [
                        { correct: false, text: i18n.hello, audioSrc: getAudio(courseTitle, "hello") },
                        { correct: true, text: i18n.goodbye, audioSrc: getAudio(courseTitle, "goodbye") },
                        { correct: false, text: i18n.please, audioSrc: getAudio(courseTitle, "please") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"yes"',
                    order: 3,
                    options: [
                        { correct: false, text: i18n.no, audioSrc: getAudio(courseTitle, "no") },
                        { correct: true, text: i18n.yes, audioSrc: getAudio(courseTitle, "yes") },
                        { correct: false, text: i18n.hello, audioSrc: getAudio(courseTitle, "hello") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"no"',
                    order: 4,
                    options: [
                        { correct: true, text: i18n.no, audioSrc: getAudio(courseTitle, "no") },
                        { correct: false, text: i18n.yes, audioSrc: getAudio(courseTitle, "yes") },
                        { correct: false, text: i18n.goodbye, audioSrc: getAudio(courseTitle, "goodbye") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"please"',
                    order: 5,
                    options: [
                        { correct: false, text: i18n.thanks, audioSrc: getAudio(courseTitle, "thanks") },
                        { correct: true, text: i18n.please, audioSrc: getAudio(courseTitle, "please") },
                        { correct: false, text: i18n.hello, audioSrc: getAudio(courseTitle, "hello") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"thanks"',
                    order: 6,
                    options: [
                        { correct: true, text: i18n.thanks, audioSrc: getAudio(courseTitle, "thanks") },
                        { correct: false, text: i18n.please, audioSrc: getAudio(courseTitle, "please") },
                        { correct: false, text: i18n.goodbye, audioSrc: getAudio(courseTitle, "goodbye") },
                    ],
                },
            ];

        case "Phrases":
            return [
                {
                    type: "ASSIST" as const,
                    question: '"good morning"',
                    order: 1,
                    options: [
                        { correct: true, text: i18n.goodMorning, audioSrc: getAudio(courseTitle, "goodMorning") },
                        { correct: false, text: i18n.goodNight, audioSrc: getAudio(courseTitle, "goodNight") },
                        { correct: false, text: i18n.hello, audioSrc: getAudio(courseTitle, "hello") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"good night"',
                    order: 2,
                    options: [
                        { correct: false, text: i18n.goodMorning, audioSrc: getAudio(courseTitle, "goodMorning") },
                        { correct: true, text: i18n.goodNight, audioSrc: getAudio(courseTitle, "goodNight") },
                        { correct: false, text: i18n.goodbye, audioSrc: getAudio(courseTitle, "goodbye") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"how are you?"',
                    order: 3,
                    options: [
                        { correct: false, text: i18n.myNameIs, audioSrc: getAudio(courseTitle, "myNameIs") },
                        { correct: true, text: i18n.howAreYou, audioSrc: getAudio(courseTitle, "howAreYou") },
                        { correct: false, text: i18n.hello, audioSrc: getAudio(courseTitle, "hello") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"my name is"',
                    order: 4,
                    options: [
                        { correct: true, text: i18n.myNameIs, audioSrc: getAudio(courseTitle, "myNameIs") },
                        { correct: false, text: i18n.howAreYou, audioSrc: getAudio(courseTitle, "howAreYou") },
                        { correct: false, text: i18n.thanks, audioSrc: getAudio(courseTitle, "thanks") },
                    ],
                },
            ];

        case "Practice":
            return [
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "water"?',
                    order: 1,
                    options: [
                        { correct: true, text: i18n.water, imageSrc: "/water.svg", audioSrc: getAudio(courseTitle, "water") },
                        { correct: false, text: i18n.food, imageSrc: "/food.svg", audioSrc: getAudio(courseTitle, "food") },
                        { correct: false, text: i18n.book, imageSrc: "/book.svg", audioSrc: getAudio(courseTitle, "book") },
                    ],
                },
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "food"?',
                    order: 2,
                    options: [
                        { correct: false, text: i18n.water, imageSrc: "/water.svg", audioSrc: getAudio(courseTitle, "water") },
                        { correct: true, text: i18n.food, imageSrc: "/food.svg", audioSrc: getAudio(courseTitle, "food") },
                        { correct: false, text: i18n.house, imageSrc: "/house.svg", audioSrc: getAudio(courseTitle, "house") },
                    ],
                },
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "house"?',
                    order: 3,
                    options: [
                        { correct: false, text: i18n.book, imageSrc: "/book.svg", audioSrc: getAudio(courseTitle, "book") },
                        { correct: true, text: i18n.house, imageSrc: "/house.svg", audioSrc: getAudio(courseTitle, "house") },
                        { correct: false, text: i18n.water, imageSrc: "/water.svg", audioSrc: getAudio(courseTitle, "water") },
                    ],
                },
                {
                    type: "SELECT" as const,
                    question: 'Which one of these is "book"?',
                    order: 4,
                    options: [
                        { correct: true, text: i18n.book, imageSrc: "/book.svg", audioSrc: getAudio(courseTitle, "book") },
                        { correct: false, text: i18n.house, imageSrc: "/house.svg", audioSrc: getAudio(courseTitle, "house") },
                        { correct: false, text: i18n.food, imageSrc: "/food.svg", audioSrc: getAudio(courseTitle, "food") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"water"',
                    order: 5,
                    options: [
                        { correct: true, text: i18n.water, audioSrc: getAudio(courseTitle, "water") },
                        { correct: false, text: i18n.food, audioSrc: getAudio(courseTitle, "food") },
                        { correct: false, text: i18n.book, audioSrc: getAudio(courseTitle, "book") },
                    ],
                },
                {
                    type: "ASSIST" as const,
                    question: '"house"',
                    order: 6,
                    options: [
                        { correct: false, text: i18n.book, audioSrc: getAudio(courseTitle, "book") },
                        { correct: true, text: i18n.house, audioSrc: getAudio(courseTitle, "house") },
                        { correct: false, text: i18n.water, audioSrc: getAudio(courseTitle, "water") },
                    ],
                },
            ];

        default:
            return [];
    }
};

const main = async () => {
    try {
        console.log("🌱 Seeding database with enhanced challenges...");

        // Delete all existing data
        console.log("🗑️  Clearing existing data...");
        await Promise.all([
            db.delete(schema.challengeProgress),
            db.delete(schema.challengeOptions),
            db.delete(schema.challenges),
            db.delete(schema.lessons),
            db.delete(schema.units),
            db.delete(schema.userProgress),
            db.delete(schema.userSubscription),
            db.delete(schema.courses),
        ]);

        // Insert courses
        console.log("📚 Creating courses...");
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

        // For each course, insert units, lessons, and challenges
        for (const course of courses) {
            console.log(`\n🎯 Processing ${course.title}...`);
            const i18n = TRANSLATIONS[course.title] ?? TRANSLATIONS.Spanish;

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

            for (const unit of units) {
                console.log(`  📖 ${unit.title}...`);
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

                for (const lesson of lessons) {
                    console.log(`    ✏️  ${lesson.title}...`);
                    const challengeConfigs = getLessonChallenges(lesson.title, i18n, course.title);

                    for (const config of challengeConfigs) {
                        const [challenge] = await db
                            .insert(schema.challenges)
                            .values({
                                lessonId: lesson.id,
                                type: config.type,
                                question: config.question,
                                order: config.order,
                            })
                            .returning();

                        await db.insert(schema.challengeOptions).values(
                            config.options.map((opt) => ({
                                challengeId: challenge.id,
                                correct: opt.correct,
                                text: opt.text,
                                imageSrc: opt.imageSrc,
                                audioSrc: opt.audioSrc,
                            }))
                        );
                    }
                }
            }
        }

        console.log("\n✅ Database seeded successfully with enhanced challenges!");
        console.log("📊 Summary:");
        console.log("   - 6 languages");
        console.log("   - 2 units per language");
        console.log("   - 5 lessons per unit");
        console.log("   - Varied challenges per lesson topic");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        throw new Error("Failed to seed database");
    }
};

void main();
