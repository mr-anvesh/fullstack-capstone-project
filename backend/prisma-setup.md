//new prisma 8 commands

npm install prisma

npx prisma@latest orm init

npm run contract:emit
npx prisma db init
npx prisma migration status


//migrate a db
npm run contract:emit
npx prisma db update
npx prisma migration status