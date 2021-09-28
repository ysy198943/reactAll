import React from 'react'
import {Link} from 'react-router-dom'

function Home() {
  return (
    <div>
      Home
      <Link to='/list'>跳转</Link>
    </div>
  )
}

export default Home
