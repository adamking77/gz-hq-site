import { defineCollection, z } from "astro:content";
const store = defineCollection({
  schema: z.object({
    title: z.string(),
    price: z.number(),
    preview: z.string(),
    checkout: z.string(),
    license: z.string(),
    highlights: z.array(z.string()),
    description: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
  }),
});
const projects = defineCollection({
  schema: z.object({
    pubDate: z.date(),
    title: z.string(),
    subtitle: z.string(),
    live: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
  }),
});
const authors = defineCollection({
  schema: z.object({
    title: z.string(),
    images: z.array(
      z.object({
        url: z.string(),
        alt: z.string(),
        name: z.string(),
        description: z.string(),
      })
    ),
  }),
});
const infopages = defineCollection({
  schema: z.object({
    page: z.string(),
    pubDate: z.date(),
  }),
});
const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    avatar: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
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
      })),
    })),
    progress_indicator: z.boolean().optional(),
  }),
});
export const collections = {
  store: store,
  projects: projects,
  authors: authors,
  infopages: infopages,
  posts: postsCollection,
  courses: courses,
};
