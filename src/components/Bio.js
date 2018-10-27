import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from '../assets/profile-pic.jpg'
import { rhythm } from '../utils/typography'
import Links from './Links'

class Bio extends React.Component {
  render() {
    const { author } = this.props.siteMetadata
    return (
      <div>
        <div
          style={{
            display: 'flex'
          }}
        >
          <img
            src={profilePic}
            alt={author.name}
            style={{
              marginRight: rhythm(1 / 2),
              marginTop: rhythm(-1 / 2),
              width: rhythm(3),
              height: rhythm(3),
              borderRadius: '50%',
            }}
          />
          <p>
            Written by <strong>{author.name}</strong> who lives and works in Hyderabad building useful things.{' '}
            <a href="http://bit.ly/agsres" target="_blank">
              Checkout his <b>Résumé</b>
            </a>
          </p>
        </div>
        <Links data={author}/>
      </div>
    )
  }
}

export default Bio
