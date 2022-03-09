import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import e from 'express'

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info'] })

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({ include: { hobbies: true } })
  res.send(users)
})

app.get('/users/:email', async (req, res) => {
  const email = req.params.email

  try {
    const user = await prisma.user.findFirst({
      where: { email },
      include: { hobbies: true }
    })

    if (user) {
      res.send(user)
    } else {
      res.status(404).send({ error: 'User not found.' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).send(`<pre>${err.message}</pre>`)
  }
})

app.post('/users', async (req, res) => {
  const { fullName, photo, email, hobbies = [] } = req.body

  try {
    const newUser = await prisma.user.create({
      data: {
        fullName,
        photo,
        email,
        hobbies: {
          // an array of {where, create} data for hobbies
          connectOrCreate: hobbies.map((hobby: any) => ({
            // try to find the hobby if it exists
            where: { name: hobby.name },
            // if it doesn't exist, create a new hobby
            create: hobby
          }))
        }
      },
      include: {
        hobbies: true
      }
    })
    res.send(newUser)
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ err: err.message })
  }
})

app.post('/addHobby', async (req, res) => {
  const { email, hobby } = req.body

  // do convoluted checking

  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: {
        hobbies: {
          connectOrCreate: {
            where: { name: hobby.name },
            create: hobby
          }
        }
      },
      include: {
        hobbies: true
      }
    })
    res.send(user)
  } catch (err) {
    // @ts-ignore
    res.status(400).send(`<pre>${err.message}</pre>`)
  }
})

app.patch('/addHobbyToUser', async (req, res) => {
  const { email, hobby } = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { hobbies: { connect: { name: hobby } } },
      include: { hobbies: true }
    })
    res.send(updatedUser)
  } catch (err) {
    // @ts-ignore
    res.status(400).send(`<pre>${err.message}</pre>`)
  }
})

app.patch('/removeHobbyFromUser', async (req, res) => {
  const { email, hobby } = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { hobbies: { disconnect: { name: hobby } } },
      include: { hobbies: true }
    })

    res.send(updatedUser)
  } catch (err) {
    // @ts-ignore
    res.status(400).send(`<pre>${err.message}</pre>`)
  }
})

// app.patch('/users/:id', async (req, res) => {
//   const { fullName, email, photo, hobbies } = req.body
//   const id = Number(req.params.id)
//   await prisma.user.update({
//     where: { id: id },
//     data: { email: email, fullName: fullName, hobbies: { connectOrCreate: [] } }
//   })
// })

app.get('/hobbies', async (req, res) => {
  const hobbies = await prisma.hobby.findMany({ include: { users: true } })
  res.send(hobbies)
})

app.get('/hobbies/:name', async (req, res) => {
  const name = req.params.name

  try {
    const hobby = await prisma.hobby.findUnique({
      where: { name },
      include: { users: true }
    })
    if (hobby) {
      res.send(hobby)
    } else {
      res.status(404).send({ error: 'Hobby not found.' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).send(`<pre>${err.message}</pre>`)
  }
})

app.get('/lol', async (req, res) => {
  const user = await prisma.user.create({
    data: {
      email: '',
      fullName: '',
      photo: '',
      hobbies: {
        connectOrCreate: {
          create: { name: '', active: true, image: '' },
          where: {}
        }
      }
    },
    include: { hobbies: true }
  })
})

app.listen(4000, () => {
  console.log(`Server up: http://localhost:4000`)
})
