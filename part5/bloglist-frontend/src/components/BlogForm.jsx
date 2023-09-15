const blogForm = ({ addBlog, newBlog, handleBlogFormChange }) => (
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

export default blogForm