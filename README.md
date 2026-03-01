# Overfullstack

Gopal S Akshintala's personal blog — **Writing & Speaking are Test-Driven-Learning**.

## Tech Stack

- **[Astro 5](https://astro.build)** — Static site generator with island architecture
- **[Tailwind CSS 4](https://tailwindcss.com)** — Utility-first CSS framework
- **[MDX](https://mdxjs.com)** — Markdown with JSX components
- **[Expressive Code](https://expressive-code.com)** — Beautiful code blocks with titles & line highlighting
- **Content Collections** — Type-safe content management with Zod schemas

## Local Development

### Prerequisites

- **Node.js 22+** (managed by [Volta](https://volta.sh) — `volta install node` if needed)
- **pnpm** — `npm install -g pnpm` or `volta install pnpm`

### Setup

```sh
git clone https://github.com/overfullstack/overfullstack.github.io.git
cd overfullstack.github.io
git checkout source-v3
pnpm install
```

### Daily workflow

```sh
pnpm dev        # Start dev server with HMR → http://localhost:4321
pnpm build      # Production build → dist/
pnpm preview    # Preview the production build locally
```

The dev server hot-reloads on every save, including Markdown content changes.

### Making changes

| What to change                | Where                                                        |
| ----------------------------- | ------------------------------------------------------------ |
| Blog posts                    | `src/content/blog/*.md`                                      |
| About / Talks / Contact pages | `src/content/pages/*.md` or `.mdx`                           |
| Header nav, footer links      | `src/components/Header.astro`, `src/components/Footer.astro` |
| Global styles / CSS variables | `src/styles/global.css`                                      |
| Site metadata, GA tag         | `src/layouts/BaseLayout.astro`                               |
| Bio text / profile info       | `src/components/Bio.astro`                                   |
| Post images / media           | `public/images/posts/<slug>/`                                |

### Writing a new blog post

1. Create `src/content/blog/your-post-slug.md`
2. Add frontmatter:

```yaml
---
title: "Your Post Title"
date: 2026-03-01
category: "Design"
tags:
  - Java
  - Refactoring
description: "One-sentence summary shown on the cards and SEO."
---
```

3. Write Markdown content below the frontmatter. The post is live at `/posts/your-post-slug/`.

**Code blocks** support titles and line highlighting via [Expressive Code](https://expressive-code.com):

````md
```java title="MyClass.java" {3,7-9}
// highlighted lines 3, 7, 8, 9
```
````

**YouTube embeds** — paste the watch URL as inline code on its own line:

```md
`youtube: https://www.youtube.com/watch?v=VIDEO_ID`
```

### Deploying

Push to the `source-v3` branch — GitHub Actions builds and deploys automatically:

```sh
git add .
git commit -m "Your commit message"
git push origin source-v3
```

Monitor the deployment at: **[github.com/overfullstack/overfullstack.github.io/actions](https://github.com/overfullstack/overfullstack.github.io/actions)**

## Project Structure

```
src/
├── components/     # Astro components (Header, Footer, PostCard, Bio)
├── content/
│   ├── blog/       # Blog posts (Markdown/MDX)
│   └── pages/      # Static pages (About, Talks, Contact)
├── content.config.ts   # Zod schemas for content collections
├── layouts/        # BaseLayout, PostLayout, PageLayout
├── pages/          # Astro file-based routes
├── plugins/        # Remark plugins (YouTube embed transformer)
└── styles/         # Global CSS (Tailwind v4 + custom vars)
public/
├── images/         # Post and page images
│   ├── posts/<slug>/
│   └── pages/<slug>/
├── favicon.png
├── logo.png
└── my-pic.png
.github/
└── workflows/
    └── deploy.yml  # GitHub Actions → GitHub Pages
```

## Content License

[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/) 

<span property="dct:title">All original content under <code>_posts</code> directory,</span>

 written by 

<span property="cc:attributionName">Gopal S Akshintala</span>

 is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).

## Software License

[![MIT License](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/800px-MIT_logo.svg.png)](https://opensource.org/licenses/MIT) All Software written by Gopal S Akshintala, is licensed under [MIT](https://opensource.org/licenses/MIT).
