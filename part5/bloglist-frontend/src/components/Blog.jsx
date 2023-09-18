import { useState, useEffect } from 'react'

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const [show, setShow] = useState(false)
  const username = user ? user.username : ''

  const visibility = { display: show ? '' : 'none' }
  return (
    <div className='blog'>
      {blog.title} {blog.author}
      <button onClick={() => {setShow(!show)}}>{show ? 'hide' : 'show'}</button>
      <div style={visibility}>
        {blog.url}
        <br/>
        likes {blog.likes}
        <button onClick={addLike}>like</button>
        <br/>
        {blog.user.name}
        <br/>
        {username === blog.user.username
          ? <button onClick={deleteBlog}>remove</button>
          : ''
        }
      </div>
    </div>
  )
}

export default Blog