//const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
//const { forEach } = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

// blogsRouter.get('/blogs', (request, response) => {

//   let stat = null
//   Blog
//     .find({})
//     .then(blogs => {
//       blogs.forEach(element =>{
//         if(!element.author)
//           stat = 400
//         else if(!element.url)
//           stat = 400
//         else
//           stat = 200
//       })
//       response.status(stat).json(blogs)
//     })
// })

blogsRouter.get('/blogs', async (request,response) => {
  const blogs = await Blog.
    find({}).populate('user', { username: 1, name: 1 })
  let stat = null
  blogs.forEach(element => {
    if(!element.author)
      stat = 400
    else if(!element.url)
      stat = 400
    else
      stat = 200
  })
  response.status(stat).json(blogs)
})

// blogsRouter.post('/blogs', (request, response) => {
//   const blog = new Blog(request.body)

//   blog
//     .save()
//     .then(result => {
//       response.status(201).json(result)
//     })
// })


blogsRouter.post('/blogs',middleware.userExtractor, async (request, response) => {

  //console.log(request.get('authorization'))
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // if (!decodedToken) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  //const user = await User.findById(decodedToken.id)
  //const user = await User.findById(blog.user)
  const user = request.user
  if (!user)
  {
    return response.status(401).json({ error:'No se encontro el Token' })
  }
  const blog = new Blog(request.body)
  if (user.id.toString() === blog.user.toString())
  {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog)
    await user.save()
    response.status(201).json(savedBlog)
  }
  else {
    response.status(401).json({ error:'usuario no valido' })
  }
})

blogsRouter.delete('/blogs/:id', async (request, response) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (!blog)
  {
    return response.status(401).json({ MIRA: `${blog}` })
  }

  if (user !== blog.user.toString())
  {
    return response.status(401).json({ error: `'token invalid' ${user}` })
  }
  await Blog.findByIdAndRemove(request.params.id)
  await User.blogs.updateMany(
    { $pull: { blogs: `${user}` } }
  )
  response.status(204).end()

})

blogsRouter.put('/blogs/:id', async (request, response) => {
  const updateBlog = request.body

  await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new: true })
  response.status(204).json(updateBlog)
})


module.exports = blogsRouter