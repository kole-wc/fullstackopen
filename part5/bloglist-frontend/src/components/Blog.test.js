import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const mockHandler = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'New blog',
      author: 'Kole Chaicharee',
      url: 'www.newblog.com',
      likes: 5,
      user: {
        name: 'Yoyo Wassup'
      }
    }

    container = render(<Blog blog={blog} addLike={mockHandler} />).container
  })

  test('at start blog`s url and likes are not displayed', async () => {
    const div = container.querySelector('.togglableSection')
    expect(div).toHaveStyle('display: none')

    const urlElement = screen.queryByText('www.newblog.com')
    const likesElement = screen.queryByText('5')
    const userElement = screen.queryByText('Yoyo Wassup')
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
    expect(userElement).toBeNull()
  })

  test('after clicking `show` button, children are displayed ', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const div = container.querySelector('.togglableSection')
    expect(div).not.toHaveStyle('display: none')

    const urlElement = screen.queryByText('www.newblog.com')
    const likesElement = screen.queryByText('5')
    const userElement = screen.queryByText('Yoyo Wassup')
    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()
    expect(userElement).toBeDefined()
  })

  test('clicking likes button twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})