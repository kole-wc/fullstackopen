import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat({ ...returnedBlog, user: user }))
        setMessage(`${returnedBlog.title} by ${returnedBlog.author} added`)
        setStatus('added')
        setTimeout(() => {
          setMessage(null)
          setStatus('')
        }, 5000)
      })
  }

  const addLike = id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...returnedBlog, user: blog.user }))
      })
      .catch(error => {
        setMessage(
          `${error}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const deleteBlog = id => {
    const blog = blogs.find(b => b.id === id)

    if (window.confirm(`Are you sure you want to remove ${blog.title} by ${blog.author}?`)) {
      blogService
        .deleteBlog(id)
        .then(response => {
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
        .catch(error => {
          setMessage(`${error}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
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
      {!user && <LoginForm login={handleLogin} />}
      {user && <div>
        <p>{user.name} logged in</p>
        <button id='logout-button' onClick={() => handleLogout()}>logout</button>
        <h2>create new</h2>
        <Togglable
          buttonLabel="new blog"
          ref={blogFormRef}
        >
          <BlogForm
            createBlog={addBlog}
          />
        </Togglable>
      </div>
      }
      {blogs.sort((a, b) => (a.likes < b.likes) ? 1 : -1).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          addLike={() => addLike(blog.id)}
          deleteBlog={() => deleteBlog(blog.id)}
          user={user}
        />
      )}
    </div>
  )
}

export default App