import { PrismaClient, Prisma } from "@prisma/client";

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
    {
      emit: 'event',
      level: 'error',
    },
  ],
});

// Listen for query events
prisma.$on('query', (e: Prisma.QueryEvent) => {
  // console.log('Query: ' + e.query);
  // console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
});

// Listen for info events
prisma.$on('info', (e) => {
  // console.log('Info: ' + e.message);
});

// Listen for warning events
prisma.$on('warn', (e) => {
  // console.warn('Warning: ' + e.message);
});

// Listen for error events
prisma.$on('error', (e) => {
  // console.error('Error: ' + e.message);
});
