import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`${returnedBlog.title} by ${returnedBlog.author} added`)
        setStatus('added')
        setTimeout(() => {
          setMessage(null)
          setStatus('')
        }, 5000)
        setNewBlog({
          title: '',
          author: '',
          url: ''
        })
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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')
      setStatus('error')
      setTimeout(() => {
        setMessage(null)
        setStatus('')
      }, 5000)
    }
  }
  
  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    blogService.setToken(null)
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification 
        message={message} 
        status={status}
      />
      {!user && <LoginForm 
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={({ target }) => setUsername(target.value)}
        setPassword={({ target }) => setPassword(target.value)}
      />}
      {user && <div>
        <p>{user.name} logged in</p>
        <button onClick={() => handleLogout()}>logout</button>
        <h2>create new</h2>
        <BlogForm 
          addBlog = {addBlog}
          newBlog = {newBlog}
          handleBlogFormChange = {handleBlogFormChange}
        />
        </div>
      }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App