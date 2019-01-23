import React from 'react';
import './style.scss';
import profilePic from '../../assets/photo.jpg';

const Bio = ({ author, subtitle, path }) => (
  <div>
    <a href={`${author.aboutme}`} target="_blank" rel="noopener noreferrer">
      <img
        src={profilePic}
        className={(path === 'posts') ? 'post-bio__author-photo' : 'bio__author-photo'}
        alt={author.name}
      />
    </a>
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
