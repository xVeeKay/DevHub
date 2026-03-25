# Architecture

## Flow

User → Next.js Server → Prisma → PostgreSQL

### Example Flow

1. User creates project
2. Session validated
3. Data stored using Prisma
4. Cache revalidated
5. UI updated