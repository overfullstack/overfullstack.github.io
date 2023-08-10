import "../../assets/scss/init.scss"

import React from "react"
import { Helmet } from "react-helmet"

export const Layout = (props) => {
  const { children } = props

  return (
    <div className="layout">
      <Helmet />
      {children}
    </div>
  )
}

export default Layout
