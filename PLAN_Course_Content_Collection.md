# Plan for Building a New "Course" Content Collection with Placeholder Data

This plan outlines the steps to create a new "course" content collection in Astro, populate it with placeholder Markdown files, and display the course content using the existing theme's styling and components where appropriate.

## Phase 1: Define Astro "courses" Content Collection Schema

**Goal**: Define the new content collection schema in Astro.

1.  **Update `src/content/config.ts`**:
    *   Define a new `courses` collection. This collection will read from Markdown files.
    *   The schema will include fields like `title`, `description`, `pubDate`, `author`, `image`, `modules`, `lessons`, `audio`, `course_image`, and `progress_indicator`.

    ```typescript
    // Proposed new schema for coursesCollection in src/content/config.ts
    const courses = defineCollection({
      schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        author: z.string(),
        image: z.object({ // Main image for the course listing
          url: z.string(),
          alt: z.string(),
        }),
        course_image: z.object({ // Dedicated image for the course detail page
          url: z.string(),
          alt: z.string(),
        }).optional(),
        modules: z.array(z.object({ // Array of modules, each with a title and lessons
          title: z.string(),
          lessons: z.array(z.object({ // Array of lessons within a module
            title: z.string(),
            slug: z.string(), // Slug for the lesson page (relative to module)
            audio: z.string().optional(), // Path to audio file for the lesson
          })),
        })),
        progress_indicator: z.boolean().optional(), // To indicate if progress tracking is enabled
      }),
    });

    export const collections = {
      // ... existing collections
      courses: courses, // Add the new courses collection
    };
    ```
    *   **Note**: The `notionId` field is removed as we are using placeholder data for now.

## Phase 2: Create Placeholder Content Files

**Goal**: Create the directory structure and sample Markdown files for courses, modules, and lessons.

1.  **Create `src/content/courses/` directory**: This will house all course content.
2.  **Create Course Markdown Files**: Each course will have its own Markdown file (e.g., `src/content/courses/my-first-course.md`). The frontmatter of these files will adhere to the `courses` schema defined in `config.ts`. The content of the Markdown file will be the course introduction.

    *   **Example `src/content/courses/my-first-course.md` frontmatter**:
        ```markdown
        ---
        title: "My First Course"
        description: "An introductory course to Astro.js"
        pubDate: 2023-10-26
        author: "Roo"
        image:
          url: "/images/blog/1.jpg" # Placeholder image
          alt: "Course Listing Image"
        course_image:
          url: "/images/blog/2.jpg" # Placeholder image
          alt: "Course Detail Image"
        modules:
          - title: "Introduction to Astro"
            lessons:
              - title: "What is Astro?"
                slug: "what-is-astro"
                audio: "/audio/lesson1-1.mp3" # Placeholder audio path
              - title: "Setting up your project"
                slug: "setting-up-project"
                audio: "/audio/lesson1-2.mp3"
          - title: "Building with Components"
            lessons:
              - title: "Astro Components"
                slug: "astro-components"
                audio: "/audio/lesson2-1.mp3"
        progress_indicator: true
        ---
        # Welcome to My First Course!
        This is the introductory content for the course.
        ```
    *   **Note**: For simplicity, we will embed module and lesson data directly within the course's frontmatter. This means each course Markdown file will contain the full structure of its modules and lessons. The actual content for each lesson will be rendered dynamically on its respective page.

## Phase 3: Create Astro Pages and Components for Courses

**Goal**: Display course content using existing theme elements and new components.

1.  **Course Listing Page (`src/pages/courses/index.astro`)**:
    *   Fetch all courses using `getCollection("courses")`.
    *   Display a list of courses. We can adapt existing components like `src/components/blog/EntriesOne.astro` or `src/components/blog/EntriesTwo.astro` by passing the correct `course` data to their props.
    *   Link to individual course pages (e.g., `/courses/my-first-course`).

2.  **Individual Course Page (`src/pages/courses/[courseSlug].astro`)**:
    *   Use `getStaticPaths` to generate paths for each course based on the `courses` collection.
    *   Fetch the specific course entry.
    *   Display course `title`, `description`, `course_image`, `author`, etc.
    *   List modules and lessons for the course.
    *   **Adapt `BlogLayout.astro`**: The `src/layouts/BlogLayout.astro` can be adapted to serve as a `CourseLayout.astro` or a new `src/layouts/CourseLayout.astro` can be created. It will need modifications to:
        *   Change `getCollection("posts")` to `getCollection("courses")` if adapting.
        *   Adjust `frontmatter` expectations to match the `courses` schema.
        *   Remove blog-specific elements like "Latest blog posts" section.
        *   Integrate new navigation components.

3.  **Lesson Page (`src/pages/courses/[courseSlug]/[lessonSlug].astro`)**:
    *   This will be the most complex dynamic route. `getStaticPaths` will need to iterate through courses, then through each module's lessons to generate paths like `/courses/my-first-course/what-is-astro`.
    *   Fetch the specific course and then locate the relevant lesson data within its `modules` array.
    *   Display the lesson content (which will be the Markdown content of the course file, but focused on the specific lesson).
    *   Integrate an `AudioPlayer.astro` component if `lesson.audio` is present.
    *   Implement clear navigation to previous/next lessons within the module and course.

4.  **New Components**:
    *   **`src/components/courses/AudioPlayer.astro`**: A component to embed and play audio files.
    *   **`src/components/courses/ProgressIndicator.astro`**: A component to display and manage user progress (this will likely require client-side JavaScript and potentially local storage for persistence).
    *   **`src/components/courses/CourseNavigation.astro`**: For navigating between courses, modules, and lessons. This component will need to receive the current course, module, and lesson data to determine previous/next links.

## Phase 4: Update Existing Functionality (Minimal Impact)

**Goal**: Ensure existing blog functionality is not broken.

1.  **Blog Pages (`src/pages/blog/*`)**:
    *   Since we are creating a *new* collection, the existing blog pages (`src/pages/blog/home.astro`, `src/pages/blog/posts/[...slug].astro`, etc.) should continue to function as before, as they still rely on `getCollection("posts")`. No changes are needed here.

2.  **RSS Feed (`src/pages/rss.xml.js`)**:
    *   The RSS feed currently uses `import.meta.glob('./blog/*.{md,mdx}')`. This will remain unchanged. If courses are to be included in the RSS feed later, this file will need modification.

3.  **Search Functionality (`src/components/blog/BlogSearch.astro`)**:
    *   The existing search component is tied to `getCollection("posts")`. It will remain unchanged. A separate search component for courses can be considered later if needed.

## High-Level Architecture Diagram (Revised)

```mermaid
graph TD
    A[src/content/config.ts (courses schema)] --> B[src/content/courses/ (Placeholder MD files)];
    B --> C[Astro Build Process];

    subgraph Astro Application
        C --> D[src/pages/courses/index.astro];
        C --> E[src/pages/courses/[courseSlug].astro];
        C --> F[src/pages/courses/[courseSlug]/[lessonSlug].astro];
        E --> G[CourseLayout.astro (adapted/new)];
        F --> H[AudioPlayer.astro];
        F --> I[ProgressIndicator.astro];
        D & E & F --> J[CourseNavigation.astro];
    end

    subgraph Existing Blog (Unaffected)
        K[src/content/posts/]
        L[src/pages/blog/posts/[...slug].astro]
        M[src/layouts/BlogLayout.astro]
        N[src/components/blog/BlogSearch.astro]
    end

    style K fill:#f9f,stroke:#333,stroke-width:2px
    style L fill:#f9f,stroke:#333,stroke-width:2px
    style M fill:#f9f,stroke:#333,stroke-width:2px
    style N fill:#f9f,stroke:#333,stroke-width:2px