import React from 'react';
import '../../assets/fonts/fontello-771c82e0/css/fontello.css';
import './style.scss';

class Links extends React.Component {
  render() {
    const author = this.props.data;
    const links = {
      twitter: author.twitter,
      github: author.github,
      linkedin: author.linkedin,
      telegram: author.telegram,
      email: author.email,
      stackoverflow: author.stackoverflow,
    };

    return this.props.isFlat ? (
      <div className="links">
        <ul className="links__list" style={{ justifyContent: `space-between` }}>
          <li className="links__list-item">
            <a
              href={`${links.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-twitter"/>
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={`${links.github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-github"/>
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={`${links.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-linkedin"/>
            </a>
          </li>
          <li className="links__list-item">
            <a href={`mailto:${links.email}`}>
              <i className="icon-mail"/>
            </a>
          </li>
          <li className="links__list-item">
            <a href={`${links.telegram}`}>
              <i className="icon-paper-plane"/>
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={links.stackoverflow}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-stackoverflow"/>
            </a>
          </li>
        </ul>
      </div>
    ) : (
      <div className="links">
        <ul className="links__list">
          <li className="links__list-item">
            <a
              href={`${links.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-twitter"/>
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={`${links.github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-github"/>
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={`${links.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-linkedin"/>
            </a>
          </li>
        </ul>
        <ul className="links__list">
          <li className="links__list-item">
            <a href={`mailto:${links.email}`}>
              <i className="icon-mail"/>
            </a>
          </li>
          <li className="links__list-item">
            <a href={`${links.telegram}`}>
              <i className="icon-paper-plane"/>
            </a>
          </li>
        </ul>
        <ul className="links__list">
          <li className="links__list-item">
            <a
              href={links.stackoverflow}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-stackoverflow"/>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Links;
