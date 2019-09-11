import React from 'react';
import { Link } from 'gatsby';
import './style.scss';
import profilePic from '../../assets/photo.jpg';

const Bio = ({ author, subtitle, path }) => (
  <div>
    <Link to={`${author.aboutme}`}>
      <img
        src={profilePic}
        className={(path === 'posts') ? 'post-bio__author-photo' : 'bio__author-photo'}
        alt={author.name}
      />
    </Link>
    {(path === '/') ? (
      <h1 className="bio__author-title">
        <a
          className="bio__author-title-link"
          href={`${author.aboutme}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'var(--textLink)',
          }}
        >
          {author.name}
        </a>
      </h1>
    ) : (
      <h2 className="bio__author-title">
        <a
          className="bio__author-title-link"
          href={`${author.aboutme}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'var(--textLink)',
          }}
        >
          {author.name}
        </a>
      </h2>
    )}
    <p className="bio__author-subtitle" style={{ marginBottom: '0.625rem' }}>{subtitle}</p>
  </div>
);

export default Bio;
