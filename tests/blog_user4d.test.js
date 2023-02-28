const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'jose',
    name: 'Jose Perez',
    passwordHash: 'password2'
  },
  {
    username: 'hellas',
    name: 'Arto Hellas',
    passwordHash: 'password'
  }
]

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

  await User.deleteMany({})
  let userObject =  new User(initialUsers[0])
  await userObject.save()
  userObject =  new User(initialUsers[1])
  await userObject.save()
})

test('succesfully created user', async () => {

  const newUser = {
    username: 'enriquito',
    name: 'Enrique Perez',
    password: 'password2'
  }

  await api
    .post('/api/users/')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  expect(User).toHaveLength(initialUsers.length +1)


})
//----------------------------------------------------------------
test('succesfully created blog', async () => {
  const userStart = await User.findOne({ username: 'jose' })


  const newBlog = {
    title:'Titulo Generico 4',
    author:'Pepito Perez',
    url:'http://localhost:3012/api/blogs',
    likes:909,
    user: userStart._id
  }

  const userForToken = {
    username: userStart.username,
    id: userStart._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  await api
    .post('/api/blogs/')
    .send(newBlog)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)
    //console.log(Blog.length)
  const userEnd = await User.findOne({ username: 'jose' })
  expect(userEnd.blogs).toHaveLength(1)

})

test('401 blog', async () => {
  const userStart = await User.findOne({ username: 'jose' })


  const newBlog = {
    title:'Titulo Generico 4',
    author:'Pepito Perez',
    url:'http://localhost:3012/api/blogs',
    likes:909,
    user: userStart._id
  }

  const userForToken = {
    username: userStart.username,
    id: userStart._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  await api
    .post('/api/blogs/')
    .send(newBlog)
  //   .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(401)
    .expect('Content-Type', /application\/json/)
    //console.log(Blog.length)
    //const userEnd = await User.findOne({username: "jose"})
    //expect(userEnd.blogs).toHaveLength(1)

})


afterAll(async () => {
  await mongoose.connection.close()
})