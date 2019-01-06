import React from 'react';
import Post from '../Post';
import './style.scss';

class CategoryTemplateDetails extends React.Component {
  render() {
    const items = [];
    const { category } = this.props.pageContext;
    const posts = this.props.data.allMarkdownRemark.edges;
    posts.forEach(post => {
      items.push(<Post data={post} key={post.node.fields.slug} />);
    });

    return (
      <div className="content">
        <div className="content__inner">
          <div className="category">
            <h1 className="category__title">{category}</h1>
            <div className="category__body">{items}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryTemplateDetails;
