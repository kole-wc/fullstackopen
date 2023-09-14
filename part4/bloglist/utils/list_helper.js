const _ = require('lodash');

const dummy = (blogs) => {
  blogs;
  return 1;
};

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes);
  return likes.reduce((sum, like) => sum + like, 0);
};

const favoriteBlog = (blogs) => {
  const highestLikes = Math.max(...blogs.map(blog => blog.likes));
  return blogs.length === 0
    ? {}
    : blogs.find(blog => blog.likes === highestLikes);
};

const mostBlogs = (blogs) => {
  const mostBlogsAuthor = _.head(_(blogs)
    .countBy('author')
    .entries()
    .maxBy(_.last));
  
  return mostBlogsAuthor;
};

const mostLikes = (blogs) => {
  const mostLikesBlog = _.chain(blogs)
    .values()
    .maxBy('likes')
    .value();

  const mostLikesAuthor = {
    author: mostLikesBlog.author,
    likes: mostLikesBlog.likes
  };

  console.log(mostLikesAuthor);

  return mostLikesAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};