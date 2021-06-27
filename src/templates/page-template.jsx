import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import PageTemplateDetails from '../components/PageTemplateDetails';
import SEO from '../components/SEO';

class PageTemplate extends React.Component {
  render() {
    const {
      subtitle,
      author,
    } = this.props.data.site.siteMetadata;
    const page = this.props.data.markdownRemark;
    const {
      title: pageTitle,
      description: pageDescription,
      cover,
    } = page.frontmatter;
    const description = pageDescription !== null ? pageDescription : subtitle;

    const actualPageTitle = `${pageTitle}`;
    return (
      <div
        style={{
          color: `var(--textNormal)`,
          background: `var(--bg)`,
          transition: `color 0.2s ease-out, background 0.2s ease-out`,
          minHeight: `100vh`,
        }}
      >
        <Layout>
          <SEO
            title={actualPageTitle}
            description={description}
            cover={cover ? cover.childImageSharp.original.src : ``}
            slug={page.fields.slug}
          />
          <div>
            <Helmet>
              <title>{`${pageTitle} | ${author.name}`}</title>
              <meta name="description" content={description}/>
            </Helmet>
            <PageTemplateDetails {...this.props} />
          </div>
        </Layout>
      </div>
    );
  }
}

export default PageTemplate;

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    site {
      siteMetadata {
        subtitle
        copyright
        declaration
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
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
