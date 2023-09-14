const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const bcrypt = require('bcrypt');

const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('secret', 10);
  const user = new User({ username: 'root', name: 'superuser',  passwordHash });

  await user.save();

  const response = await api.post('/api/login').send(helper.loginInfo);
  process.env.TEST_TOKEN = response.body.token;

  const usersInDb = await helper.usersInDb();
  const superUser = usersInDb[0];

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog({ ...blog, user: superUser.id });
    await blogObject.save();
  }
});

describe('when logging in', () => {
  test('login is successful with correct username and password', async () => {
    await api.post('/api/login')
      .send(helper.loginInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('login fails with wrong username', async () => {
    const userForLogin = {
      username: 'rooty',
      password: 'secret'
    };

    const result = await api.post('/api/login')
      .send(userForLogin)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('invalid username or password');
  });

  test('login fails with wrong password', async () => {
    const userForLogin = {
      username: 'root',
      password: 'secretsdfsdf'
    };

    const result = await api.post('/api/login')
      .send(userForLogin)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('invalid username or password');
  });
});

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs/');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
  
  test('blogs id are returned as id not _id', async () => {
    const response = await api.get('/api/blogs');
  
    const ids = response.body.map(r => r.id);
    expect(ids).toBeDefined();
  });
});

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).toContain('Roots');
  });
  
  test('a blog without likes specify will default likes value to 0', async () => {
    const newBlogNoLikes = { ...helper.newBlog, likes: undefined };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .send(newBlogNoLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    expect(response.body.likes).toEqual(0);
  });
  
  test('a blog without title or url is returned as bad request', async () => {
    const newBlogNoTitleNoUrl = { ...helper.newBlog, title: undefined, url: undefined };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .send(newBlogNoTitleNoUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('adding a new blog fails if token is not provided', async () => {
    const token = '' ;

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(helper.newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('jwt must be provided');
  });
});

describe('deletion of a blog', () => {
  test('successful with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .expect(204);
    
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .expect(400);
  });
});

describe('updating of a note', () => {
  test('succeeds with updated data', async () => {
    const blogs = await helper.blogsInDb();

    const blogToUpdate = blogs[0];
    const newBlogToUpdate = { ...blogToUpdate, title: 'Common React patterns' };

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    expect(updatedBlog.body).not.toEqual(blogToUpdate);
  });

  test('fails with status code 400 if id is invalid', async () => {
    const blogs = await helper.blogsInDb();

    const blogToUpdate = blogs[0];
    const newBlogToUpdate = { ...blogToUpdate, title: 'Common React patterns' };

    const invalidId = '5a3d5da59070081a82a3445';

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(newBlogToUpdate)
      .expect(400);
  });
});

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    await api
      .post('/api/users')
      .send(helper.newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(helper.newUser.username);
  });

  test('creation fails if username is not given', async () => {
    const newUserNoUsername = {
      ...helper.newUser,
      username: undefined
    };

    const result = await api
      .post('/api/users')
      .send(newUserNoUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('User validation failed: username: Path `username` is required.');
  });

  test('creation fails if password is not given', async () => {
    const newUserNoPassword = {
      ...helper.newUser,
      password: undefined
    };

    const result = await api
      .post('/api/users')
      .send(newUserNoPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password is required');
  });

  test('creation fails if password is shorter than 3 characters', async () => {
    const newUserTooShortPassword = {
      ...helper.newUser,
      password: 'sdf'
    };

    const result = await api
      .post('/api/users')
      .send(newUserTooShortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password must be longer than 3 characters');
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'secret',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});