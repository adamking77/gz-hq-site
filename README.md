# GZS Astro Theme (Working Title)

A modern, flexible, and reusable Astro theme designed for [describe target use-case, e.g., corporate sites, portfolios, blogs]. This theme provides a collection of well-crafted components, layouts, and styling defaults to kickstart your Astro project.

## Installation

```bash
npm install gzs-astro-midcentury-theme # Or your chosen package name
```
You will also need to install peer dependencies like React, Tailwind CSS, and Astro integrations if not already present in your project. This theme uses `@astrojs/react` and `@astrojs/tailwind`.

## Usage

Import layouts and components into your Astro pages:

```astro
---
import BaseLayout from 'gzs-astro-midcentury-theme/layouts/BaseLayout.astro';
import { Button } from 'gzs-astro-midcentury-theme/components/ui/button.tsx';
---
<BaseLayout title="My Page" description="An example page using the theme.">
  <h1>Hello from the Theme!</h1>
  <Button>Click Me</Button>
</BaseLayout>
```
Refer to `docs/THEME_ARCHITECTURE.md` for more details on available components and customization.

## Customization

*(Placeholder)*

Learn how to tailor the theme to your specific needs:

*   **Styling:**
    *   **Tailwind CSS:** How to extend or override the theme's Tailwind configuration.
    *   **CSS Variables:** A list of available CSS variables and how to override them.
*   **Content:**
    *   **Props:** Customizing components and layouts by passing props.
    *   **Slots:** Using Astro slots to inject custom content.
    *   **Content Collections:** Replacing or extending example content.
*   **Data:** Providing custom data to components.

---

*This theme is currently under development.*
