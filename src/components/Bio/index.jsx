import React from 'react';
import { Link } from 'gatsby';
import './style.scss';
import profilePic from '../../assets/photo.jpg';

const Bio = ({ author, subtitle, path }) => (
  <div>
    <Link to="/">
      <img
        src={profilePic}
        className={(path === 'posts') ? 'post-bio__author-photo' : 'bio__author-photo'}
        alt={author.name}
      />
    </Link>
    {(path === '/') ? (
      <h1 className="bio__author-title">
        <Link className="bio__author-title-link" to="/">
          {author.name}
        </Link>
      </h1>
    ) : (
      <h2 className="bio__author-title">
        <Link className="bio__author-title-link" to="/">
          {author.name}
        </Link>
      </h2>
    )}
    <p className="bio__author-subtitle" style={{ marginBottom: '0.625rem' }}>{subtitle}</p>
  </div>
);

export default Bio;
