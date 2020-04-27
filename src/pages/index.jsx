import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Post from '../components/Post';
import Sidebar from '../components/Sidebar';
import SEO from '../components/SEO';

class IndexRoute extends React.Component {
  render() {
    const items = [];
    const { blogTitle, subtitle, caption, logo, author } = this.props.data.site.siteMetadata
    const posts = this.props.data.allMarkdownRemark.edges;
    posts.forEach(post => {
      items.push(<Post data={post} key={post.node.fields.slug} />)
    });

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
            cover={logo}
            description={subtitle}
            caption={caption}
          />
          <div>
            <Helmet>
              <title>{`${author.name} | ${blogTitle}`}</title>
              <meta name="description" content={subtitle}/>
            </Helmet>
            <Sidebar {...this.props} />
            <div className="content">
              <div className="content__inner">{items}</div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}

export default IndexRoute;

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        blogTitle
        subtitle
        caption
        copyright
        declaration
        logo
        menu {
          label
          path
        }
        author {
          name
          email
          telegram
          twitter
          github
          linkedin
          stackoverflow
          aboutme
        }
      }
    }
    allMarkdownRemark(
      limit: 1000
      filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          timeToRead
          frontmatter {
            title
            date
            category
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
    }
  }
`;
