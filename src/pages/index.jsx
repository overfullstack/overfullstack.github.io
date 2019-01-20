import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Post from '../components/Post';
import Sidebar from '../components/Sidebar';
import SEO from '../components/SEO';

class IndexRoute extends React.Component {
  render() {
    const items = [];
    const { title, subtitle, caption, logo } = this.props.data.site.siteMetadata;
    const posts = this.props.data.allMarkdownRemark.edges;
    posts.forEach(post => {
      items.push(<Post data={post} key={post.node.fields.slug} />);
    });

    return (
      <Layout>
        <SEO image={logo} description={subtitle} title={title} caption={caption} />
        <div>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={subtitle} />
          </Helmet>
          <Sidebar {...this.props} />
          <div className="content">
            <div className="content__inner">{items}</div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default IndexRoute;

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
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
