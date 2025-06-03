// sync-notion-course.js
// Script to fetch course data from a Notion database and generate a Markdown file for Astro.

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import slugify from 'slugify';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
// IMPORTANT: For production, store NOTION_API_KEY in an environment variable.
// The COURSE_DATABASE_ID can also be an environment variable or a script argument.
const NOTION_API_KEY = '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'; // Replace with your actual key or use process.env.NOTION_API_KEY
const COURSE_DATABASE_ID = '20539a7d43de80c49d4bc5cb4fe32f46'; // Replace with your actual Course Database ID or use process.env.COURSE_DATABASE_ID or pass as arg

const notion = new Client({ auth: NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, 'src', 'content', 'courses');

/**
 * Parses the Notion database description to extract course metadata and introduction text.
 * @param {Array<Object>} dbDescriptionRichText - The rich text array from the Notion database description.
 * @returns {{metadata: Object, introductionText: string}}
 */
function parseDbDescription(dbDescriptionRichText) {
    const defaultIntro = "# Course Introduction\n\nPlaceholder for course introduction. Edit this with content from your Notion database description if it's not automatically parsed.";
    if (!dbDescriptionRichText || dbDescriptionRichText.length === 0) {
        return { metadata: {}, introductionText: defaultIntro };
    }

    const fullDescriptionText = dbDescriptionRichText.map(rt => rt.plain_text).join('');
    const lines = fullDescriptionText.split('\n');

    const metadata = {};
    const potentialIntroLines = [];
    const knownKeys = [
        "Course Title", "Description", "PubDate", "Author",
        "Image URL", "Image Alt", "Course Image URL", "Course Image Alt",
        "Progress Indicator", "Custom Info Heading", "Custom Info Body"
    ];
    // Regex to capture "Key: Value"
    const metadataLineRegex = new RegExp(`^(${knownKeys.join('|')}):\\s*(.*)`);

    let inCustomInfoBody = false;
    let customInfoBodyLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(metadataLineRegex);

        if (match) {
            inCustomInfoBody = false; // Reset if we hit a new key
            const key = match[1].trim();
            let value = match[2].trim();

            if (key === "Custom Info Body") {
                customInfoBodyLines.push(value); // Add the first line
                inCustomInfoBody = true;
            } else if (key === "PubDate") {
                const d = new Date(value);
                metadata.pubDate = !isNaN(d.getTime()) ? d : value;
            } else if (key === "Progress Indicator") {
                metadata.progress_indicator = value.toLowerCase() === 'true';
            } else if (key === "Course Title") {
                metadata.title = value;
            } else if (key === "Description") {
                metadata.description = value;
            } else if (key === "Author") {
                metadata.author = value;
            } else if (key === "Image URL" && value) {
                metadata.image = { ...metadata.image, url: value };
            } else if (key === "Image Alt" && value) {
                metadata.image = { ...metadata.image, alt: value };
            } else if (key === "Course Image URL" && value) {
                metadata.course_image = { ...metadata.course_image, url: value };
            } else if (key === "Course Image Alt" && value) {
                metadata.course_image = { ...metadata.course_image, alt: value };
            } else if (key === "Custom Info Heading") {
                metadata.customInfoHeading = value;
            }
        } else {
            // If we are in the Custom Info Body, collect the line (even if empty)
            if (inCustomInfoBody) {
                customInfoBodyLines.push(line); // Keep original spacing, don't trim here
            } else {
                potentialIntroLines.push(line);
            }
        }
    }

    if (customInfoBodyLines.length > 0) {
        metadata.customInfoBody = customInfoBodyLines.join('\n');
    }

    // Ensure optional image objects are structured correctly or removed if empty
    // if (metadata.image) {
    //     if (!metadata.image.url && !metadata.image.alt) delete metadata.image;
    //     else if (!metadata.image.url) metadata.image.url = ""; // Zod might need url to be present if image obj exists
    //     else if (!metadata.image.alt) metadata.image.alt = ""; // Zod might need alt to be present
    // }
    if (metadata.course_image) {
        if (!metadata.course_image.url && !metadata.course_image.alt) delete metadata.course_image;
        else if (!metadata.course_image.url) metadata.course_image.url = "";
        else if (!metadata.course_image.alt) metadata.course_image.alt = "";
    }
    
    let introductionText = potentialIntroLines.join('\n').trim();
    if (!introductionText) {
        introductionText = defaultIntro;
    }

    return { metadata, introductionText };
}

/**
 * Main function to orchestrate fetching, transforming, and writing course data.
 */
async function main() {
    if (!NOTION_API_KEY || !COURSE_DATABASE_ID) {
        console.error("Error: NOTION_API_KEY or COURSE_DATABASE_ID is not set.");
        console.log("Please configure them at the top of the script or via environment variables.");
        return;
    }

    try {
        console.log(`Fetching course metadata from Notion database ID: ${COURSE_DATABASE_ID}...`);
        const db = await notion.databases.retrieve({ database_id: COURSE_DATABASE_ID });

        if (!db) {
            console.error("Could not retrieve database information from Notion.");
            return;
        }

        console.log("Parsing database description for course-level metadata...");
        const { metadata: courseMetadata, introductionText } = parseDbDescription(db.description);

        if (!courseMetadata.title) {
            const dbTitleText = db.title?.map(t => t.plain_text).join('') || "Untitled Course from DB";
            console.warn(`Warning: "Course Title" not found in database description. Using database title: "${dbTitleText}"`);
            courseMetadata.title = dbTitleText;
        }
        
        console.log(`Fetching lessons from Notion database: ${COURSE_DATABASE_ID}...`);
        const lessonsQuery = await notion.databases.query({
            database_id: COURSE_DATABASE_ID,
            // Add filters here if needed (e.g., for 'Status' property if you only want published lessons)
            sorts: [
                {
                    property: 'Order', // Ensure 'Order' property (Number type) exists on your Notion lessons
                    direction: 'ascending',
                },
            ],
        });

        const allLessonData = [];
        console.log(`Found ${lessonsQuery.results.length} potential lessons. Processing...`);

        for (const page of lessonsQuery.results) {
            let lessonTitle = null;
            // Find the property with type 'title' to robustly get the lesson title
            for (const propertyName in page.properties) {
                const propertyObject = page.properties[propertyName];
                if (propertyObject && propertyObject.type === 'title') {
                    if (propertyObject.title && propertyObject.title.length > 0) {
                        lessonTitle = propertyObject.title[0].plain_text;
                    }
                    break; // Found the title-type property, assume only one
                }
            }
            if (!lessonTitle) {
                console.warn(`Skipping lesson (ID: ${page.id}) due to missing 'Lesson Title'.`);
                continue;
            }

            // Fetch Markdown content for each lesson page (as per requirement)
            // Note: This content is not directly used in the output COURSE_SLUG.md file's body or frontmatter
            // based on the current task scope, but it's fetched as requested.
            const mdBlocks = await n2m.pageToMarkdown(page.id);
            const lessonMarkdownContent = n2m.toMarkdownString(mdBlocks);

            allLessonData.push({
                id: page.id,
                title: lessonTitle,
                moduleName: page.properties['Module']?.select?.name || null,
                // Ensure 'Slug' property (Text type) exists or generate one
                slug: page.properties['Slug']?.rich_text[0]?.plain_text || slugify(lessonTitle, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }),
                // Ensure 'Audio' property (URL or Text type) exists
                audio: page.properties['Audio']?.url || (page.properties['Audio']?.rich_text?.length > 0 ? page.properties['Audio']?.rich_text[0]?.plain_text : undefined),
                // Ensure 'Icon' property (Text or Select type) exists
                icon: (page.properties['Icon']?.rich_text?.length > 0 ? page.properties['Icon']?.rich_text[0]?.plain_text : undefined) || page.properties['Icon']?.select?.name,
                description: page.properties['Description']?.rich_text[0]?.plain_text || undefined, // Added for standalone lessons
                order: page.properties['Order']?.number || 0,
                body: lessonMarkdownContent.parent // Store the actual markdown content
            });
        }
        console.log(`Successfully processed ${allLessonData.length} lessons with titles.`);

        // Structure data for YAML frontmatter
        const frontmatter = { ...courseMetadata }; // Start with course-level metadata

        // Ensure 'image' field is present in frontmatter
        const courseTitleForImageAlt = frontmatter.title; // Already guaranteed to exist by lines 123-127
        const placeholderImageUrl = "/images/placeholder-course.jpg";
        // Use course title for alt, or a generic fallback if title is somehow empty or just whitespace
        const placeholderImageAlt = (typeof courseTitleForImageAlt === 'string' && courseTitleForImageAlt.trim() !== "")
                                    ? courseTitleForImageAlt.trim()
                                    : "Course image";

        const notionImageUrl = frontmatter.image?.url;
        const notionImageAlt = frontmatter.image?.alt;

        // Determine final URL: use Notion's if it's a non-empty string, otherwise placeholder
        const finalImageUrl = (typeof notionImageUrl === 'string' && notionImageUrl.trim() !== "")
                              ? notionImageUrl.trim()
                              : placeholderImageUrl;

        // Determine final Alt: use Notion's if it's a non-empty string, otherwise constructed placeholder
        const finalImageAlt = (typeof notionImageAlt === 'string' && notionImageAlt.trim() !== "")
                              ? notionImageAlt.trim()
                              : placeholderImageAlt;
        
        frontmatter.image = {
            url: finalImageUrl,
            alt: finalImageAlt
        };
        const modulesMap = new Map();
        const standaloneLessonsArray = []; // Initialize array for standalone lessons

        for (const lesson of allLessonData) {
            if (lesson.moduleName && lesson.moduleName.trim() !== "") {
                if (!modulesMap.has(lesson.moduleName)) {
                    modulesMap.set(lesson.moduleName, []);
                }
                // Store lesson data needed for frontmatter, including order for sorting
                modulesMap.get(lesson.moduleName).push({
                    title: lesson.title,
                    slug: lesson.slug,
                    audio: lesson.audio,
                    icon: lesson.icon,
                    order: lesson.order,
                });
            } else {
                // This lesson has no module, so it's a standalone lesson
                console.log(`Lesson "${lesson.title}" (ID: ${lesson.id}) is a standalone lesson.`);
                standaloneLessonsArray.push({
                    title: lesson.title,
                    slug: lesson.slug,
                    description: lesson.description, // Will be undefined if not present
                    icon: lesson.icon,           // Will be undefined if not present
                    audio: lesson.audio,          // Will be undefined if not present
                    body: lesson.body            // Add the fetched markdown body
                });
            }
        }
        
        frontmatter.standaloneLessons = standaloneLessonsArray; // Add to frontmatter
        frontmatter.modules = [];
        // Sort module names alphabetically for consistent output
        const sortedModuleNames = Array.from(modulesMap.keys()).sort();

        for (const moduleTitle of sortedModuleNames) {
            const lessonsInModule = modulesMap.get(moduleTitle)
                .sort((a, b) => a.order - b.order) // Sort lessons by 'Order' property
                .map(l => ({ // Select only fields defined in the Astro schema for a lesson
                    title: l.title,
                    slug: l.slug,
                    audio: l.audio, // Will be undefined if not present, handled by z.optional()
                    icon: l.icon,   // Will be undefined if not present, handled by z.optional()
                }));
            frontmatter.modules.push({ title: moduleTitle, lessons: lessonsInModule });
        }
        // If modulesMap is empty (no lessons had modules), frontmatter.modules will remain `[]`.

        console.log("Generating Markdown file for the course...");
        const courseFileSlug = slugify(courseMetadata.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
        const outputFilePath = path.join(OUTPUT_DIR, `${courseFileSlug}.md`);

        // Ensure output directory exists
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
            console.log(`Created output directory: ${OUTPUT_DIR}`);
        }

        const yamlFrontmatter = yaml.dump(frontmatter, { sortKeys: false, lineWidth: -1 }); // lineWidth -1 for no wrapping
        const fileContent = `---
${yamlFrontmatter}---
`;
        fs.writeFileSync(outputFilePath, fileContent);
        console.log(`Successfully generated Markdown file: ${outputFilePath}`);
        console.log("\nScript finished.");

    } catch (error) {
        console.error("\n--- ERROR DURING SCRIPT EXECUTION ---");
        if (error.code === 'unauthorized' || (error.body && JSON.parse(error.body).code === 'unauthorized')) {
            console.error("Notion API Error: Unauthorized. Check your NOTION_API_KEY and ensure the integration has access to the database.");
        } else if (error.message && error.message.includes("Could not find property with name Order")) {
            console.error("Notion API Error: The 'Order' property likely doesn't exist or is misnamed in your Notion database. It's required for sorting lessons.");
        } else {
            console.error("An unexpected error occurred:", error.message);
            console.error("Full error object:", error);
        }
        console.error("-------------------------------------\n");
    }
}

main();