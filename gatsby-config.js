const lost = require("lost")
const pxtorem = require("postcss-pxtorem")

module.exports = {
  siteMetadata: {
    url: "https://github.com/overfullstack/overfullstack.github.io",
    siteUrl: "https://overfullstack.github.io",
    blogTitle: "Overfullstack",
    subtitle:
      "So excited about this Craft that, I can't keep myself from blogging about it.",
    caption: "It's All Over full-stack",
    copyright: "© All rights reserved.",
    declaration: "I built this blog with React.js",
    disqusShortname: "gopal",
    pathPrefix: "/overfullstack.github.io",
    logo: "src/assets/logo.png",
    menu: [
      {
        label: "Articles",
        path: "/",
      },
      {
        label: "About me",
        path: "/about-me/",
      },
      {
        label: "My Talks 🎤",
        path: "/my-talks/",
      },
      {
        label: "Contact me",
        path: "/contact-me/",
      },
    ],
    author: {
      name: "Gopal S Akshintala",
      email: "gopal.akshintala@gmail.com",
      telegram: "https://t.me/gopalakshintala",
      twitter: "http://bit.ly/agstwtr",
      github: "http://bit.ly/agsgithub",
      resume: "http://bit.ly/ags-my-resume",
      linkedin: "http://bit.ly/agslnkd",
      stackoverflow: "http://bit.ly/agsso",
      aboutme: "/about-me",
    },
    social: {
      twitter: "@GopalAkshintala",
    },
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          {
            site {
              siteMetadata {
                site_url: siteUrl
                title: blogTitle
                description: subtitle
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map((edge) => {
                return {
                  ...edge.node.frontmatter,
                  description: edge.node.frontmatter.description,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.site_url + edge.node.fields.slug,
                  guid: site.siteMetadata.site_url + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                }
              }),
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
                ) {
                  edges {
                    node {
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        layout
                        draft
                        description
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Overfullstack's RSS",
          },
        ],
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
            },
          },
          {
            resolve: "gatsby-remark-embed-video",
            options: {
              width: 640,
              ratio: 1.77,
              related: false,
              noIframeBorder: true,
            },
          },
          {
            resolve: "gatsby-remark-embed-markdown",
            options: {
              directory: `${__dirname}/src/pages/`,
            },
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 640,
            },
          },
          "gatsby-remark-code-titles",
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              inlineCodeMarker: "~",
              showLineNumbers: true,
            },
          },
          {
            resolve: "gatsby-remark-autolink-headers",
            options: {
              offsetY: "100",
              className: "anchor",
              maintainCase: true,
              removeAccents: true,
              isIconAfterHeader: true,
            },
          },
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "noopener noreferrer",
            },
          },
          {
            resolve: "gatsby-plugin-mailchimp",
            options: {
              endpoint:
                "https://github.us7.list-manage.com/subscribe/post?u=ab6b858fe942240463c3a5ab5&amp;id=8851ab5056",
            },
          },
          {
            resolve: "gatsby-remark-embed-gist",
            options: {
              // Optional:

              // the github handler whose gists are to be accessed
              username: "overfullstack",

              // a flag indicating whether the github default gist css should be included or not
              // default: true
              includeDefaultCss: true,
            },
          },
        ],
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: { trackingId: "UA-73379983-2" },
    },
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: ["roboto:400,400i,500,700"],
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
            {
              site {
                siteMetadata {
                  siteUrl
                }
              }
              allSitePage(
                filter: {
                  path: { regex: "/^(?!/404/|/404.html|/dev-404-page/)/" }
                }
              ) {
                edges {
                  node {
                    path
                  }
                }
              }
          }`,
        output: "/sitemap.xml",
        serialize: ({ site, allSitePage }) =>
          allSitePage.edges.map((edge) => {
            return {
              url: site.siteMetadata.siteUrl + edge.node.path,
              changefreq: "daily",
              priority: 0.7,
            }
          }),
      },
    },
    "gatsby-plugin-offline",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-sass",
      options: {
        postCssPlugins: [
          lost(),
          pxtorem({
            rootValue: 16,
            unitPrecision: 5,
            propList: [
              "font",
              "font-size",
              "line-height",
              "letter-spacing",
              "margin",
              "margin-top",
              "margin-left",
              "margin-bottom",
              "margin-right",
              "padding",
              "padding-top",
              "padding-left",
              "padding-bottom",
              "padding-right",
              "border-radius",
              "width",
              "max-width",
            ],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 0,
          }),
        ],
        precision: 8,
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Gopal's Over full-stack",
        short_name: "Gopal's Over full-stack",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/assets/favicon.png",
        theme_color_in_head: false,
      },
    },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-131255680-1",
        // Puts tracking script in the head instead of the body
        head: true,
        // Any additional create only fields (optional)
      },
    },
  ],
}
