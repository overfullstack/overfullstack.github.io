import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import PostTemplateDetails from '../components/PostTemplateDetails';
import SEO from '../components/SEO';

class PostTemplate extends React.Component {
  render() {
    const { title, subtitle } = this.props.data.site.siteMetadata;
    const post = this.props.data.markdownRemark;
    const { title: postTitle, description: postDescription, cover } = post.frontmatter;
    const description = postDescription !== null ? postDescription : subtitle;

    const actualPostTitle = `${postTitle} - ${title}`;
    return (
      <div style={{
        color: 'var(--textNormal)',
        background: 'var(--bg)',
        transition: 'color 0.2s ease-out, background 0.2s ease-out',
        minHeight: '100vh',
      }}
      >
        <Layout>
          <SEO
            title={actualPostTitle}
            description={description}
            image={cover.childImageSharp.original.src}
            slug={post.fields.slug}
          />
          <div>
            <Helmet>
              <title>{actualPostTitle}</title>
              <meta name="description" content={description}/>
            </Helmet>
            <PostTemplateDetails {...this.props} />
          </div>
        </Layout>
      </div>
    );
  }
}

export default PostTemplate;

export const pageQuery = graphql`
  query PostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        subtitle
        copyright
        declaration
        author {
          name
          twitter
          github
          linkedin
          telegram
          email
          stackoverflow
          aboutme
        }
        disqusShortname
        url
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      fields {
        tagSlugs
        slug
      }
      frontmatter {
        title
        tags
        date
        description
        cover {
          childImageSharp {
            original {
              src
            }
          }
        }
      }
    }
  }
`;
