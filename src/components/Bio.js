import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Gopal S Akshintala`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        <p>
          Written by <strong>Gopal S Akshintala</strong> who lives and works in Hyderabad building useful things.{' '}
          <a href="http://bit.ly/agstwtr">
            You should follow him on Twitter
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
