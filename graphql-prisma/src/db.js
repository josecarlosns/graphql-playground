const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@email.com',
    age: 22
  },
  {
    id: '2',
    name: 'Mary Sue',
    email: 'marysue@email.com',
    age: 31
  },
  {
    id: '3',
    name: 'Mike Sho',
    age: 21
  }
];

const posts = [
  {
    id: '12',
    title: 'so theory',
    body: "I'm hungry",
    published: true,
    author: '1'
  },
  {
    id: '13',
    title: 'marketing',
    body: 'who are you?',
    published: true,
    author: '1'
  },
  {
    id: '14',
    title: 'publishing',
    body: 'bcuz of course',
    published: true,
    author: '3'
  }
];

const comments = [
  {
    id: '11',
    author: '1',
    post: '13',
    body: 'My name is methos'
  },
  {
    id: '22',
    author: '2',
    post: '13',
    body: "I'm Quelana of Izalith"
  },
  {
    id: '33',
    author: '2',
    post: '14',
    body: 'Of course what?'
  },
  {
    id: '21',
    author: '3',
    post: '14',
    body: 'Of course'
  }
];

const db = {
  users,
  posts,
  comments
};

export default db;
