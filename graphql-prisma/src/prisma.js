import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

const queryUsers = async () => {
  let start = new Date();
  const res = await prisma.query.users(
    null,
    '{ id name email }'
  );
  start = new Date() - start;

  console.log(JSON.stringify(res, null, 2));
  console.log(`Time (ms): ${start}`);
};

const createPost = async () => {
  let start = new Date();

  const res1 = await prisma.mutation.createPost(
    {
      data: {
        title: 'Created from NodeJS',
        body: 'The mitochondria is the powerhouse of the cell',
        published: true,
        author: {
          connect: {
            email: 'jcns@email.com'
          }
        }
      }
    },
    '{ id title author { id name } }'
  );

  start = new Date() - start;

  console.log(JSON.stringify(res1, null, 2));
  console.log(`Time: ${start}`);
};

const createUserAndPost = async (name, email) => {
  let start = new Date();
  const res = await prisma.mutation
    .createUser(
      {
        data: {
          name,
          email
        }
      },
      '{ id name email }'
    )
    .then(res =>
      prisma.mutation.createPost(
        {
          data: {
            title: `${res.name}'s first post!`,
            body: `My email is ${res.email} if you wanna chat`,
            published: false,
            author: {
              connect: {
                id: res.id
              }
            }
          }
        },
        '{ id title body published author { id name } }'
      )
    );
  start = new Date() - start;

  console.log(JSON.stringify(res, null, 2));
  console.log(`Time: ${start}`);
};

queryUsers();
// createPost();
// createUserAndPost('John Doe Jr.', 'jdj@email.com');