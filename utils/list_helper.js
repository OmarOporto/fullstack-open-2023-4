var _ = require('underscore-contrib')

const dummy = (blogs) => {
  return(1)
}

const totalLikes = (blogs) => {

  const Mayor = Math.max(...blogs.map(x => x.likes))
  return(Mayor)
}

const favoriteBlog = (blogs) => {

  const Mayor = Math.max(...blogs.map(x => x.likes))
  const Favorite = blogs.filter(x => x.likes === Mayor)
  const result = {
    title: Favorite[0].title,
    author: Favorite[0].author,
    likes: Favorite[0].likes
  }
  //console.log(result)
  return(result)
}

const mostBlogs = (blogs) => {

  const names = blogs.map(x => x.author)
  const res = _.frequencies(names)
  const key = Object.keys(res)
  const b = Object.values(res)
  const result = {
    author: `${key[b.indexOf(Math.max(...b))]}`,
    blogs: Math.max(...b)
  }
  return(result)
}

const mostLikes = (blogs) => {

  const names = blogs.map(x => x.author)
  const res = _.frequencies(names)

  const key = Object.keys(res)

  let prueba = []
  key.forEach(myFunction)

  function myFunction(item,i)
  {   let s = 0
    prueba [i] = blogs.map((x,i,arr) => {
      if(x.author === item)
      {
        s = s + x.likes
      }

      if (arr.length - 1 === i) {
        return(s)
      }

    })
  }

  prueba = prueba.map(x => x.filter(val => val !== undefined) ).flat()

  const result = {
    author: `${key[prueba.indexOf(Math.max(...prueba))]}`,
    likes: Math.max(...prueba)
  }
  //console.log(prueba)
  return(result)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}