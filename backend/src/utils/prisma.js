// util/prisma.js
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const getPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate())
}

export default getPrismaClient
