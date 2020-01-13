const query = {
  users(parent, args, { db }, info) {
    if (args.query)
      return db.users.filter(user =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );

    return db.users;
  },
  posts(parent, args, { db }, info) {
    return db.posts;
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  }
};

export default query;
