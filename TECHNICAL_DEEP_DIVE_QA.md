# 🔬 Technical Deep Dive Q&A

## Advanced Technical Questions for Exam

---

## CODE-LEVEL QUESTIONS

### Q: Explain this code from your pronunciation feature
```typescript
const updateWordProgress = (spokenText: string) => {
  const spokenWords = normalize(spokenText).split(/\s+/).filter(Boolean);
  const targetWords = words.map(w => normalize(w));
  // ... matching logic
}
```

**Answer**: This function updates word-by-word progress during pronunciation practice. It:
1. Normalizes spoken text (lowercase, remove accents)
2. Splits into individual words
3. Compares each spoken word to target words
4. Uses Levenshtein distance to calculate similarity
5. Marks words as complete if similarity >= 60%
6. Updates progress bar based on completed words

---

### Q: How does your JWT authentication work?

**Answer**: 
```typescript
// Login (app/api/admin/login/route.ts):
1. Receive username/password
2. Verify against .env credentials
3. Create JWT token with SignJWT
4. Set expiration (24h)
5. Return token to client

// Verification (app/api/admin/verify/route.ts):
1. Receive token from client
2. Verify with jwtVerify
3. Check role === "admin"
4. Return valid/invalid status

// Client-side (app/admin/page.tsx):
1. Store token in localStorage
2. Send token with each request
3. Auto-redirect if invalid
```

---

### Q: Explain your database schema relationships

**Answer**:
```typescript
// schema.ts
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  // ...
});
```

**Key Points**:
- Foreign keys link tables
- `onDelete: "cascade"` removes related data
- Serial IDs for auto-increment
- Not null constraints for required fields

---

### Q: How do you handle API errors?

**Answer**:
```typescript
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
```

**Error Handling**:
- Try-catch blocks
- Appropriate HTTP status codes
- Clear error messages
- Server-side logging

---

## ARCHITECTURE QUESTIONS

### Q: Explain Next.js App Router vs Pages Router

**Answer**:
**App Router** (What I used):
- File-based routing in `app/` directory
- Server Components by default
- Layouts and nested routes
- Loading and error states
- Route groups with (parentheses)

**Pages Router** (Old way):
- File-based routing in `pages/` directory
- Client-side rendering by default
- getServerSideProps for SSR
- Less flexible layouts

**Why App Router**: Modern, better performance, more features

---

### Q: What are Server Components and when did you use them?

**Answer**:
**Server Components**:
- Render on server only
- No JavaScript sent to client
- Can access database directly
- Better performance

**Used in**:
- Static pages (marketing page)
- Data fetching (course lists)
- Layouts (shared UI)

**Client Components** ("use client"):
- Interactive features
- Event handlers
- React hooks
- Speech recognition
- Admin panel

---

### Q: How does Drizzle ORM work?

**Answer**:
```typescript
// Define schema
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
});

// Query data
const allCourses = await db.select().from(courses);

// Insert data
await db.insert(courses).values({
  title: "Spanish",
  imageSrc: "/es.svg"
});

// Update data
await db.update(courses)
  .set({ title: "Español" })
  .where(eq(courses.id, 1));
```

**Benefits**:
- Type-safe queries
- SQL-like syntax
- Auto-completion
- Migration support

---

## ALGORITHM QUESTIONS

### Q: Explain Levenshtein Distance algorithm in detail

**Answer**:
```typescript
function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, 
    () => new Array(n + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return dp[m][n];
}
```

**How it works**:
1. Creates 2D matrix
2. Calculates minimum edits needed
3. Returns edit distance
4. Lower distance = more similar

**Time Complexity**: O(m * n)
**Space Complexity**: O(m * n)

---

### Q: How do you normalize text for comparison?

**Answer**:
```typescript
function normalize(s: string) {
  return s
    .toLowerCase()                    // "Hello" → "hello"
    .normalize("NFD")                 // Decompose accents
    .replace(/\p{Diacritic}+/gu, "") // Remove accents
    .replace(/[^\p{Letter}\p{Number}\s]/gu, "") // Keep only letters/numbers
    .replace(/\s+/g, " ")            // Single spaces
    .trim();                          // Remove edges
}
```

**Why**: Makes comparison accent-insensitive and case-insensitive

---

## SECURITY QUESTIONS

### Q: How do you prevent SQL injection?

**Answer**:
**Using Drizzle ORM**:
```typescript
// SAFE - Parameterized query
await db.select()
  .from(courses)
  .where(eq(courses.id, userId));

// UNSAFE - String concatenation (DON'T DO THIS)
// await db.execute(`SELECT * FROM courses WHERE id = ${userId}`);
```

**Protection**:
- ORM handles parameterization
- No raw SQL with user input
- Type checking prevents errors

---

### Q: How do you secure environment variables?

**Answer**:
1. **Storage**: `.env` file (not committed to git)
2. **Access**: Only server-side code
3. **Validation**: Check if variables exist
4. **Production**: Use platform environment variables (Vercel)
5. **Secrets**: Never expose to client

```typescript
// Server-side only
const secret = process.env.ADMIN_JWT_SECRET;

// Client-side (NEXT_PUBLIC_ prefix)
const publicUrl = process.env.NEXT_PUBLIC_APP_URL;
```

---

### Q: How do you prevent XSS attacks?

**Answer**:
1. **React**: Auto-escapes content
2. **Sanitization**: Never use `dangerouslySetInnerHTML`
3. **CSP Headers**: Content Security Policy
4. **Input Validation**: Validate all user input
5. **Output Encoding**: Encode special characters

---

## PERFORMANCE QUESTIONS

### Q: How do you optimize images?

**Answer**:
```typescript
import Image from "next/image";

<Image
  src="/mascot.png"
  alt="Mascot"
  width={42}
  height={42}
  priority // For above-fold images
/>
```

**Next.js Image Benefits**:
- Automatic optimization
- Lazy loading
- Responsive images
- WebP format
- Blur placeholder

---

### Q: How do you handle loading states?

**Answer**:
```typescript
// Skeleton screens
if (loading) {
  return <div className="animate-pulse">Loading...</div>;
}

// Suspense boundaries
<Suspense fallback={<Loading />}>
  <Component />
</Suspense>

// Loading states in components
const [loading, setLoading] = useState(false);
```

---

## DATABASE QUESTIONS

### Q: Explain ACID properties in your database

**Answer**:
**A - Atomicity**: Transaction succeeds completely or fails completely
- Example: Creating course with units - all or nothing

**C - Consistency**: Data follows all rules
- Example: Foreign keys ensure valid references

**I - Isolation**: Concurrent transactions don't interfere
- Example: Two users updating different courses

**D - Durability**: Committed data persists
- Example: Completed lessons stay completed

---

### Q: What are database indexes and did you use them?

**Answer**:
**Indexes**: Speed up queries by creating lookup tables

**Used in**:
- Primary keys (automatic)
- Foreign keys (automatic)
- User ID lookups

**Trade-off**:
- Faster reads
- Slower writes
- More storage

---

## API DESIGN QUESTIONS

### Q: Explain RESTful API principles in your project

**Answer**:
```
GET    /api/courses       - List all courses
POST   /api/courses       - Create course
GET    /api/courses/:id   - Get specific course
PUT    /api/courses/:id   - Update course
DELETE /api/courses/:id   - Delete course
```

**Principles**:
- Resource-based URLs
- HTTP methods for actions
- Status codes (200, 201, 404, 500)
- JSON responses
- Stateless requests

---

### Q: How do you handle CORS?

**Answer**:
```typescript
// next.config.mjs
async headers() {
  return [{
    source: "/api/(.*)",
    headers: [
      { key: "Access-Control-Allow-Origin", value: "*" },
      { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE" },
      { key: "Access-Control-Allow-Headers", value: "Content-Type" },
    ],
  }];
}
```

**Why**: Allows admin panel to access API from same origin

---

## REACT QUESTIONS

### Q: Explain useState vs useEffect

**Answer**:
**useState**: Manages component state
```typescript
const [count, setCount] = useState(0);
// Re-renders when state changes
```

**useEffect**: Side effects and lifecycle
```typescript
useEffect(() => {
  // Runs after render
  fetchData();
  
  return () => {
    // Cleanup
  };
}, [dependency]); // Runs when dependency changes
```

---

### Q: What are React hooks you used?

**Answer**:
- **useState**: Component state
- **useEffect**: Side effects, data fetching
- **useRef**: DOM references, mutable values
- **useCallback**: Memoized functions
- **useMemo**: Memoized values
- **useRouter**: Next.js navigation
- **useAuth**: Clerk authentication

---

## TYPESCRIPT QUESTIONS

### Q: Why use TypeScript over JavaScript?

**Answer**:
**Benefits**:
1. **Type Safety**: Catch errors at compile time
2. **IntelliSense**: Better autocomplete
3. **Refactoring**: Safer code changes
4. **Documentation**: Types as documentation
5. **Tooling**: Better IDE support

**Example**:
```typescript
// TypeScript catches this error
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John",
  age: "25" // Error: Type 'string' is not assignable to type 'number'
};
```

---

### Q: Explain interfaces vs types

**Answer**:
```typescript
// Interface (extendable)
interface User {
  name: string;
}
interface Admin extends User {
  role: string;
}

// Type (more flexible)
type User = {
  name: string;
}
type Admin = User & {
  role: string;
}
```

**Used**: Interfaces for objects, types for unions/intersections

---

## DEPLOYMENT QUESTIONS

### Q: How would you deploy this to production?

**Answer**:
**Platform**: Vercel (Next.js optimized)

**Steps**:
1. Push code to GitHub
2. Connect Vercel to repository
3. Add environment variables
4. Configure build settings
5. Deploy

**Environment Variables**:
- Database URL
- Clerk keys
- Stripe keys
- Admin credentials
- JWT secret

**Database**: Neon PostgreSQL (already cloud-hosted)

---

### Q: What about CI/CD?

**Answer**:
**Continuous Integration**:
- GitHub Actions
- Run tests on push
- Check TypeScript errors
- Lint code

**Continuous Deployment**:
- Vercel auto-deploys on push
- Preview deployments for PRs
- Production deployment on main branch

---

## TESTING QUESTIONS

### Q: How would you test the pronunciation feature?

**Answer**:
**Unit Tests**:
- Test Levenshtein algorithm
- Test normalize function
- Test word matching logic

**Integration Tests**:
- Test speech recognition flow
- Test progress updates
- Test scenario selection

**E2E Tests**:
- Test complete user flow
- Test with different browsers
- Test with different accents

**Tools**: Jest, React Testing Library, Playwright

---

### Q: What is property-based testing?

**Answer**:
**Concept**: Test with random inputs instead of specific examples

**Example**:
```typescript
// Instead of:
test("normalize removes accents", () => {
  expect(normalize("café")).toBe("cafe");
});

// Property-based:
test("normalize always returns lowercase", () => {
  forAll(randomString, (str) => {
    expect(normalize(str)).toBe(normalize(str).toLowerCase());
  });
});
```

---

## FINAL TECHNICAL QUESTIONS

### Q: What design patterns did you use?

**Answer**:
1. **Component Pattern**: Reusable UI components
2. **Container/Presenter**: Logic vs presentation
3. **Provider Pattern**: Context for state
4. **Repository Pattern**: Database abstraction
5. **Factory Pattern**: Dynamic component creation
6. **Singleton**: Database connection

---

### Q: Explain your error handling strategy

**Answer**:
**Layers**:
1. **Database**: Try-catch on queries
2. **API**: Error responses with status codes
3. **Frontend**: Error boundaries, toast notifications
4. **User**: Clear error messages

**Example**:
```typescript
try {
  await db.insert(courses).values(data);
} catch (error) {
  console.error("Database error:", error);
  return NextResponse.json(
    { error: "Failed to create course" },
    { status: 500 }
  );
}
```

---

### Q: How do you ensure code quality?

**Answer**:
1. **TypeScript**: Type checking
2. **ESLint**: Code linting
3. **Prettier**: Code formatting
4. **Code Reviews**: Manual review
5. **Testing**: Unit and integration tests
6. **Documentation**: Comments and README

---

**You're technically prepared! 🚀**

Remember: If you don't know something, explain what you DO know and how you would find the answer.
