import { defineConfig } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  earlyAccessFeatures: {
    driverAdapters: true,
  },
  schema: './prisma/schema.prisma',
})