const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


const Blog = require('../models/blog')

const initialBlogs = [
  {

    title:'Titulo Generico 1',
    author:'Steven Spilverg',
    url:'http://localhost:3003/api/blogs',
    likes:909
  },
  {
    title:'Titulo Generico 2',
    author:'Alberto Goya',
    url:'http://localhost:3333/api/blogs',
    likes:2912
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('id like unique identifier', async () => {

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.id)
  //console.log(contents[0])
  expect(contents[0]).toBeDefined()
})

test('succesfully created blog', async () => {

  const newBlog = {

    title:'Titulo Generico 4',
    author:'Pepito Perez',
    url:'http://localhost:3012/api/blogs',
    likes:909
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    //console.log(Blog.length)
  expect(Blog).toHaveLength(initialBlogs.length +1)

})

test('Verify LIKES', async () => {

  const newBlog = {

    title:'Titulo Generico 4',
    author:'Pepito Perez',
    url:'http://localhost:3012/api/blogs',

  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r)
  //console.log(contents[initialBlogs.length])
  expect(contents[initialBlogs.length].likes).toBe(0)

})

test('Verify Title and Url', async () => {

  const newBlog = {

    author:'Pepito Perez',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  await api
    .get('/api/blogs')
    .expect(400)

})

test('Verify Deleting blogs', async () => {

  const blogAtStart = await api.get('/api/blogs')
  const blogDeleted = blogAtStart[0]

  await api
    .delete(`/api/blogs/${blogDeleted.id}`)
    .expect(204)
  const blogAtFinish = await api.get('/api/blogs')
  const ids = blogAtFinish.map(r => r.id)

  expect(blogAtFinish).toHaveLength(
    initialBlogs.length -1
  )

  expect(ids).not.toContain(blogDeleted.id)
})

test('Verify the updates', async () => {
  const blogAtStart = await api.get('/api/blogs')
  const blogtoUpdate = blogAtStart[0]
  const newBlog = {
    title: blogtoUpdate.title,
    author:blogtoUpdate.author,
    url:blogtoUpdate.url,
    likes:999
  }
  await api
    .put(`/api/blogs/${blogtoUpdate.id}`)
    .send(newBlog)

  const blogsAtEnd = await api.get('/api/blogs')
  const newLikes = blogsAtEnd[0].likes
  expect(newLikes).toBe(999)
})



afterAll(async () => {
  await mongoose.connection.close()
})