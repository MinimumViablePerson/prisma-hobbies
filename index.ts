import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import e from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info'] })

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({ include: { hobbies: true } })
  res.send(users)
})

// app.get('/users', async (req, res) => {
//   // check if hobby exists
//   let hobby = await prisma.hobby.findFirst({ where: { name: 'Cooking ' } })

//   // create it if it doesn't
//   if (!hobby) {
//     hobby = await prisma.hobby.create({
//       data: { name: 'Cooking', image: 'cooking.job', active: true }
//     })
//   }

//   // add it to the user
//   const user = await prisma.user.update({
//     where: { email: 'nicolas@email.com' },
//     data: { hobbies: { connect: {name: "Cooking"} }
//   })

//   res.send(user)
// })

app.post('/users', async (req, res) => {
  const { fullName, photo, email, hobbies = [] } = req.body

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
})

app.post('/addHobby', async (req, res) => {
  const { email, hobby } = req.body
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

app.listen(4000, () => {
  console.log(`Server up: http://localhost:4000`)
})
