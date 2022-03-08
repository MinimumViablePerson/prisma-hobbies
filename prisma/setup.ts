import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info'] })

const hobbies = [
  {
    name: 'Knitting',
    image: 'knitting.jpg',
    active: false
  },
  {
    name: 'Rugby',
    image: 'rugby.jpg',
    active: true
  },
  {
    name: 'Cooking',
    image: 'cooking.jpg',
    active: true
  },
  {
    name: 'Anime',
    image: 'anime.jpg',
    active: false
  }
]

const users = [
  {
    fullName: 'Nicolas',
    photo: 'nico.jpeg',
    email: 'nicolas@email.com',
    hobbies: {
      connect: [{ name: 'Knitting' }, { name: 'Rugby' }]
    }
  },
  {
    fullName: 'Rinor',
    photo: 'rinor.jpeg',
    email: 'rinor@email.com',
    hobbies: {
      connect: [{ name: 'Rugby' }, { name: 'Anime' }]
    }
  },
  {
    fullName: 'Arita',
    photo: 'arita.jpeg',
    email: 'arita@email.com',
    hobbies: {
      connect: [{ name: 'Knitting' }, { name: 'Cooking' }]
    }
  }
]

async function createStuff () {
  for (const hobby of hobbies) {
    await prisma.hobby.create({ data: hobby })
  }

  for (const user of users) {
    await prisma.user.create({ data: user })
  }
}

createStuff()
