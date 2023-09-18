import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls onSubmit handler with correct contents', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title...')
  const authorInput = screen.getByPlaceholderText('author...')
  const urlInput = screen.getByPlaceholderText('url...')
  const sendButton = screen.getByText('save')

  await user.type(titleInput, 'New blog')
  await user.type(authorInput, 'Kole Chaicharee')
  await user.type(urlInput, 'www.newblog.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('New blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Kole Chaicharee')
  expect(createBlog.mock.calls[0][0].url).toBe('www.newblog.com')
})