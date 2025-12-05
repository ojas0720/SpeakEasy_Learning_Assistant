# Guide: Adding More Challenges to SpeakEasy

## Overview
Your SpeakEasy app currently has basic challenges for each lesson. This guide explains how to add more varied and interesting challenges for each language and lesson.

## Current Structure

### Database Schema
- **Courses** → **Units** → **Lessons** → **Challenges** → **Challenge Options**
- 6 Languages: Spanish, French, German, Hindi, Kannada, Tamil
- 2 Units per language
- 5 Lessons per unit: People, Characters, Basics, Phrases, Practice
- Currently: Same 8 challenges repeated for all lessons

## Challenge Types

### 1. SELECT Type
- Shows images with text options
- User selects the correct answer
- Example: "Which one of these is 'the man'?"

### 2. ASSIST Type  
- Shows text options only (no images)
- User selects the correct translation
- Example: Select the translation for "hello"

## Adding Challenges via Admin Panel

### Method 1: Using the Admin Interface (Easiest)

1. **Access Admin Panel**
   - Go to `http://localhost:3001/admin`
   - You need to be logged in as an admin user

2. **Navigate to Challenges**
   - Click on "Challenges" in the sidebar
   - Click "Create" to add a new challenge

3. **Fill in Challenge Details**
   - **Lesson ID**: Select the lesson this challenge belongs to
   - **Type**: Choose SELECT or ASSIST
   - **Question**: Enter the question text (e.g., 'Which one of these is "the cat"?')
   - **Order**: Set the order number (1, 2, 3, etc.)

4. **Add Challenge Options**
   - Go to "Challenge Options"
   - Create 3 options for each challenge
   - Set one as `correct: true`, others as `correct: false`
   - Add text, imageSrc (for SELECT type), and audioSrc

### Method 2: Using the Enhanced Seed Script

I've created an enhanced seed script at `scripts/seed-enhanced.ts` that includes:

**Lesson-Specific Challenges:**

#### People Lesson
- "the man", "the woman", "the boy", "the girl"
- 6 challenges with images

#### Characters Lesson  
- "the zombie", "the robot", "the cat", "the dog"
- 6 challenges with images

#### Basics Lesson
- "hello", "goodbye", "yes", "no", "please", "thanks"
- 6 ASSIST-type challenges (text only)

#### Phrases Lesson
- "good morning", "good night", "how are you?", "my name is"
- 4 ASSIST-type challenges

#### Practice Lesson
- "water", "food", "house", "book"
- 6 challenges with images

**To run the enhanced seed:**
```bash
npm run db:seed
```

⚠️ **Warning**: This will delete all existing data and reseed the database!

## Adding New Vocabulary

### Step 1: Add Translations

Edit `scripts/seed-enhanced.ts` and add new words to the `TRANSLATIONS` object:

```typescript
const TRANSLATIONS: Record<string, Record<string, string>> = {
  Spanish: {
    // ... existing words
    apple: "la manzana",
    tree: "el árbol",
    // add more...
  },
  French: {
    // ... existing words
    apple: "la pomme",
    tree: "l'arbre",
    // add more...
  },
  // ... other languages
};
```

### Step 2: Add Images (if needed)

For SELECT-type challenges, add SVG images to the `public/` folder:
- `/apple.svg`
- `/tree.svg`
- etc.

### Step 3: Add Audio Files (optional)

Add audio files for pronunciation:
- `/es_apple.mp3` (Spanish)
- `/fr_apple.mp3` (French)
- `/de_apple.mp3` (German)
- etc.

### Step 4: Create Challenge Configurations

In `seed-enhanced.ts`, add new challenges to the `getLessonChallenges` function:

```typescript
case "Food": // New lesson
  return [
    {
      type: "SELECT" as const,
      question: 'Which one of these is "apple"?',
      order: 1,
      options: [
        { correct: true, text: i18n.apple, imageSrc: "/apple.svg", audioSrc: getAudio(courseTitle, "apple") },
        { correct: false, text: i18n.orange, imageSrc: "/orange.svg", audioSrc: getAudio(courseTitle, "orange") },
        { correct: false, text: i18n.banana, imageSrc: "/banana.svg", audioSrc: getAudio(courseTitle, "banana") },
      ],
    },
    // ... more challenges
  ];
```

## Adding New Lessons

### Step 1: Add Lesson to Database

In `seed-enhanced.ts`, add to the lessons array:

```typescript
const lessons = await db
  .insert(schema.lessons)
  .values([
    { unitId: unit.id, title: "People", order: 1 },
    { unitId: unit.id, title: "Characters", order: 2 },
    { unitId: unit.id, title: "Basics", order: 3 },
    { unitId: unit.id, title: "Phrases", order: 4 },
    { unitId: unit.id, title: "Practice", order: 5 },
    { unitId: unit.id, title: "Food", order: 6 }, // NEW LESSON
    { unitId: unit.id, title: "Colors", order: 7 }, // NEW LESSON
  ])
  .returning();
```

### Step 2: Add Challenge Configuration

Add a new case in `getLessonChallenges`:

```typescript
case "Food":
  return [
    // ... your food-related challenges
  ];

case "Colors":
  return [
    // ... your color-related challenges
  ];
```

## Quick Reference: Challenge Structure

```typescript
{
  type: "SELECT" | "ASSIST",
  question: "Question text in English",
  order: 1, // Sequential number
  options: [
    {
      correct: true, // Only one should be true
      text: "Translation in target language",
      imageSrc: "/image.svg", // Optional, for SELECT type
      audioSrc: "/es_word.mp3", // Optional, for pronunciation
    },
    // ... 2 more options (total of 3)
  ],
}
```

## Testing Your Changes

1. **Run the seed script:**
   ```bash
   npm run db:seed
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Test in the app:**
   - Go to http://localhost:3001
   - Sign in
   - Select a course
   - Start a lesson
   - Verify your new challenges appear

## Tips for Creating Good Challenges

1. **Variety**: Mix SELECT and ASSIST types
2. **Difficulty**: Start easy, gradually increase difficulty
3. **Context**: Group related words in the same lesson
4. **Distractors**: Make wrong answers plausible but clearly wrong
5. **Images**: Use clear, simple SVG images
6. **Audio**: Include pronunciation for better learning

## Troubleshooting

### Database Connection Issues
- Check your `.env` file has correct `DATABASE_URL`
- Verify your Neon database is active
- Try running `npm run db:push` first

### Seed Script Fails
- Make sure all referenced images exist in `/public`
- Check that all translations are provided for all languages
- Verify the database schema is up to date

### Challenges Don't Appear
- Check the lesson ID is correct
- Verify the order numbers are sequential
- Make sure at least one option is marked as correct

## Need Help?

- Check the admin panel at `/admin` to view existing data
- Use `/simple-admin` for a simpler interface
- Review the database schema in `db/schema.ts`
- Look at existing challenges in the database for examples

---

**Happy Challenge Creating! 🎯**
