import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }

    createBlog(blogObject)

    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  const handleBlogFormChange = (event) => {
    if (event.target.id === 'title') {
      setNewBlog({ ...newBlog, title: event.target.value })
    } else if (event.target.id === 'author') {
      setNewBlog({ ...newBlog, author: event.target.value })
    } else if (event.target.id === 'url') {
      setNewBlog({ ...newBlog, url: event.target.value })
    }
  }

  return(
    <form onSubmit={addBlog}>
      title:
      <input
        id="title"
        value={newBlog.title}
        onChange={handleBlogFormChange}
      />
      <br/>
      author:
      <input
        id="author"
        value={newBlog.author}
        onChange={handleBlogFormChange}
      />
      <br/>
      url:
      <input
        id="url"
        value={newBlog.url}
        onChange={handleBlogFormChange}
      />
      <br/>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm