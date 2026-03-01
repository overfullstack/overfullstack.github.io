# Overfullstack

Gopal S Akshintala's personal blog — **Writing & Speaking are Test-Driven-Learning**.

## Tech Stack

- **[Astro 5](https://astro.build)** — Static site generator with island architecture
- **[Tailwind CSS 4](https://tailwindcss.com)** — Utility-first CSS framework
- **[MDX](https://mdxjs.com)** — Markdown with JSX components
- **[Expressive Code](https://expressive-code.com)** — Beautiful code blocks with titles & line highlighting
- **Content Collections** — Type-safe content management with Zod schemas

## Development

```sh
npm install
npm run dev        # Start dev server at http://localhost:4321
npm run build      # Build for production (output in dist/)
npm run preview    # Preview the production build locally
```

## Project Structure

```
src/
├── components/     # Astro components (Header, Footer, PostCard, Bio)
├── content/
│   ├── blog/       # Blog posts (Markdown/MDX)
│   └── pages/      # Static pages (About, Talks, Contact)
├── layouts/        # BaseLayout, PostLayout, PageLayout
├── pages/          # Astro page routes
├── plugins/        # Remark plugins (YouTube embed)
└── styles/         # Global CSS with Tailwind
public/
├── images/         # Post images and media
├── favicon.png
├── logo.png
└── my-pic.png
```

## Deployment

Deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`). Push to `main` to trigger a deploy.

## Content License

[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/) 

<span property="dct:title">All original content under <code>_posts</code> directory,</span>

 written by 

<span property="cc:attributionName">Gopal S Akshintala</span>

 is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).

## Software License

[![MIT License](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/800px-MIT_logo.svg.png)](https://opensource.org/licenses/MIT) All Software written by Gopal S Akshintala, is licensed under [MIT](https://opensource.org/licenses/MIT).
