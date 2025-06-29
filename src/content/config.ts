import { defineCollection, z } from 'astro:content';

const reportsCollection = defineCollection({
  type: 'data', // Using 'data' type for JSON files
  schema: z.object({
    id: z.string(),
    // slug is derived from the filename, but we can include it in the schema
    // if it's also present in the data source and used explicitly.
    // For Astro's getCollection, slug is part of the entry object automatically.
    // We will include it here to match the source data structure.
    slug: z.string(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    author: z.string(),
    publishDate: z.string(), // Keep as string for "Month YYYY" format
    category: z.string(),
    tags: z.array(z.string()),
    readTime: z.string(),
    featured: z.boolean(),
    // imageUrl: z.string().optional(), // Not in source data
    // sections: z.array(z.object({ type: z.string(), content: z.any() })).optional(), // Not in source data
  }),
});

const courses = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    course_image: z.object({
      url: z.string(),
      alt: z.string(),
    }).optional(),
    modules: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(), // Will correspond to keys in ICONS
      lessons: z.array(z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(), // Will correspond to keys in ICONS
        audio: z.string().optional(),
        body: z.string().optional(), // Added body for regular lessons
      })),
    })),
    // Add the new field here:
    standaloneLessons: z.array(z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      audio: z.string().optional(),
      body: z.string().optional(), // Added body for standalone lessons
    })).optional(), // Make it optional
    customInfoHeading: z.string().optional(),
    customInfoBody: z.string().optional(),
    progress_indicator: z.boolean().optional(),
  }),
});

export const collections = {
  reports: reportsCollection,
  courses: courses,
};