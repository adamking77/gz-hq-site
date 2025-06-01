# Plan for Implementing Enhanced Lesson Navigation

This plan outlines the steps to update the lesson navigation functionality in `src/pages/courses/[courseSlug]/[lessonSlug].astro` by modifying the existing `src/components/courses/CourseNavigation.astro` component.

## 1. Data Aggregation for Lesson Sequence (within `CourseNavigation.astro`)

The core of the enhancement lies in creating a unified, ordered list of all lessons for a course.

*   **Objective:** Generate a flat array of lesson objects, `allLessons`, within the `CourseNavigation.astro` component.
*   **Method:**
    1.  Access `course.data.standaloneLessons` and `course.data.modules`.
    2.  Iterate through `standaloneLessons` first (if they exist). For each standalone lesson, create an object and add it to `allLessons`.
    3.  Then, iterate through `course.data.modules`. For each module, iterate through its `lessons` array. For each lesson within a module, create an object and add it to `allLessons`.
*   **Order of Lessons:**
    1.  Standalone lessons will appear first in the `allLessons` array, in the order they are defined in the course frontmatter.
    2.  Lessons from modules will follow, ordered by module, and then by lesson within each module, as defined in the frontmatter.
*   **Structure of Each Item in `allLessons`:**
    Each object in the `allLessons` array should contain at least:
    *   `title`: (string) The title of the lesson.
    *   `slug`: (string) The slug of the lesson.
    *   `url`: (string) The full URL to the lesson page (e.g., `/courses/{courseSlug}/{lessonSlug}`).
    *   `courseSlug`: (string) The slug of the course (from `course.slug`).
    *   *(Optional but recommended for clarity)* `type`: (string) Either `'standalone'` or `'module'` to distinguish origin.
    *   *(Optional for module lessons)* `moduleSlug`: (string) If the lesson belongs to a module.

    **Example `allLessons` structure:**
    ```javascript
    // Inside CourseNavigation.astro
    const allLessons = [];
    const courseSlug = course.slug;

    // 1. Add standalone lessons
    if (course.data.standaloneLessons) {
      for (const lesson of course.data.standaloneLessons) {
        allLessons.push({
          title: lesson.title,
          slug: lesson.slug,
          url: `/courses/${courseSlug}/${lesson.slug}`,
          courseSlug: courseSlug,
          type: 'standalone'
        });
      }
    }

    // 2. Add lessons from modules
    if (course.data.modules) {
      for (const module of course.data.modules) {
        // Assuming module might have its own slug, though not used in lesson URL per current structure
        // const moduleSlug = module.slug; 
        for (const lesson of module.lessons) {
          allLessons.push({
            title: lesson.title,
            slug: lesson.slug,
            url: `/courses/${courseSlug}/${lesson.slug}`,
            courseSlug: courseSlug,
            type: 'module',
            // moduleSlug: moduleSlug 
          });
        }
      }
    }
    ```

## 2. Passing Data to Lesson Page

The lesson page (`src/pages/courses/[courseSlug]/[lessonSlug].astro`) already passes the necessary `course` object and `currentLessonSlug` string as props to the `CourseNavigation.astro` component.

```astro
<CourseNavigation course={course} currentLessonSlug={lesson.slug} />
```

This setup is sufficient. The data aggregation logic described in point 1 will occur *inside* the `CourseNavigation.astro` component using these props.

## 3. Navigation Logic on Lesson Page (within `CourseNavigation.astro`)

The existing logic in `CourseNavigation.astro` for finding previous and next lessons needs to be updated to use the `allLessons` array.

*   **Identify Current Lesson:**
    *   Find the index of the current lesson in the `allLessons` array by comparing `lesson.slug` with the `currentLessonSlug` prop.
    ```javascript
    const currentIndex = allLessons.findIndex(lesson => lesson.slug === currentLessonSlug);
    ```
*   **Determine Previous Lesson:**
    *   If `currentIndex` is greater than 0, the previous lesson is `allLessons[currentIndex - 1]`.
    *   Store its `title` and `url`.
*   **Determine Next Lesson:**
    *   If `currentIndex` is less than `allLessons.length - 1`, the next lesson is `allLessons[currentIndex + 1]`.
    *   Store its `title` and `url`.
*   **Construct "Back to Course Home" URL:**
    *   This URL is straightforward: `/courses/${course.slug}`.

## 4. UI/Component Structure

We will modify the existing `src/components/courses/CourseNavigation.astro` component.

*   **Props:** The component will continue to accept `course: CollectionEntry<'courses'>` and `currentLessonSlug: string`.
*   **Presentation:**
    *   "Previous Lesson" and "Next Lesson" links can retain their current styling (links with chevrons).
    *   The "Back to Course Home" link should be added, likely positioned centrally or distinctly from the prev/next links.
    *   **Example Markup Structure (Conceptual):**
        ```html
        <nav class="flex justify-between items-center mt-12 pt-4 border-t ...">
          <!-- Previous Lesson Link -->
          {prevLesson ? (
            <a href={prevLesson.url} class="...">
              <svg>...</svg>
              <span>{prevLesson.title}</span>
            </a>
          ) : (
            <span></span> <!-- Placeholder -->
          )}

          <!-- Back to Course Home Link -->
          <a href={`/courses/${course.slug}`} class="text-gray-600 hover:underline">
            Back to Course Home
          </a>

          <!-- Next Lesson Link -->
          {nextLesson ? (
            <a href={nextLesson.url} class="... ml-auto">
              <span>{nextLesson.title}</span>
              <svg>...</svg>
            </a>
          ) : (
            <span></span> <!-- Placeholder -->
          )}
        </nav>
        ```

## 5. Handling Edge Cases

The UI should adapt when at the beginning or end of the lesson sequence.

*   **No Previous Lesson (First Lesson):**
    *   The "Previous Lesson" link should not be rendered or be visually disabled.
*   **No Next Lesson (Last Lesson):**
    *   The "Next Lesson" link should not be rendered or be visually disabled.
*   **"Back to Course Home":** This link should always be visible.

---