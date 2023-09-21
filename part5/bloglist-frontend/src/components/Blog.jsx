import { useState, useEffect } from 'react'

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const [show, setShow] = useState(false)
  const username = user ? user.username : null
  const visibility = { display: show ? '' : 'none' }
  return (
    <div className='blog'>
      {blog.title} {blog.author}
      <button id='display-button' onClick={() => {setShow(!show)}}>{show ? 'hide' : 'show'}</button>
      <div style={visibility} className='togglableSection'>
        {blog.url}
        <br/>
        likes {blog.likes}
        <button id='like' onClick={addLike}>like</button>
        <br/>
        {blog.user.name}
        <br/>
        {username === blog.user.username
          ? <button id='delete' onClick={deleteBlog}>remove</button>
          : ''
        }
      </div>
    </div>
  )
}

export default Blog