import uuid from 'uuid/v4';

const mutation = {
  // USERS
  createUser(parent, args, { db, pubsub }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);

    if (emailTaken) {
      throw new Error('Email already taken!');
    }

    const user = {
      id: uuid(),
      ...args.data
    };

    db.users.push(user);
    pubsub.publish('users', {
      user
    });

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userFound = db.users.find(user => user.id === args.id);

    if (!userFound) throw new Error('User not found!');

    db.users = db.users.filter(user => user.id !== args.id);

    db.posts = db.posts.filter(post => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }

      return !match;
    });

    db.comments = db.comments.filter(comment => comment.author !== args.id);

    return userFound;
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;

    const user = db.users.find(user => user.id === id);

    if (!user) throw new Error('User not found');

    if (data.email) {
      const emailTaken = db.users.find(user => user.email === data.email);

      if (emailTaken) throw new Error('Email taken');

      user.email = data.email;
    }

    if (data.name) user.name = data.name;

    if (data.age) user.age = data.age;

    return user;
  },

  // POSTS
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) throw new Error('Author not found!');

    const newPost = {
      id: uuid(),
      ...args.data
    };

    db.posts.push(newPost);
    if (newPost.published)
      pubsub.publish('posts', {
        post: {
          mutation: 'CREATE',
          data: newPost
        }
      });
    return newPost;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const deletedPost = db.posts.find(post => post.id === args.id);

    if (!deletedPost) throw new Error('Post not found');

    db.posts = db.posts.filter(post => {
      const match = post.id === args.id;

      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }

      return !match;
    });

    if (deletedPost.published)
      pubsub.publish('posts', {
        post: {
          mutation: 'DELETE',
          data: deletedPost
        }
      });

    return deletedPost;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;

    const updatedPost = db.posts.find(post => post.id === id);

    if (!updatedPost) throw new Error('Post not found');

    if (data.title) updatedPost.title = data.title;

    if (data.body) updatedPost.body = data.body;

    if (data.author) updatedPost.author = data.author;

    if (data.published !== undefined) updatedPost.published = data.published;

    pubsub.publish('posts', {
      post: {
        mutation: 'UPDATED',
        data: updatedPost
      }
    });

    return updatedPost;
  },

  // COMMENTS
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    const postExists = db.posts.some(post => post.id === args.data.post);

    if (!userExists) throw new Error('Author not found!');

    if (!postExists) throw new Error('Post not found!');

    const newComment = {
      id: uuid(),
      ...args.data
    };

    db.comments.push(newComment);
    pubsub.publish(`POST.${args.data.post}.COMMENTS`, {
      comment: {
        mutation: 'CREATE',
        data: newComment
      }
    });

    return newComment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const deletedComment = db.comments.find(comment => comment.id === args.id);

    if (!deletedComment) throw new Error('Comment not found');

    db.comments = db.comments.filter(comment => comment.id !== args.id);

    pubsub.publish(`POST.${deletedComment.post}.COMMENTS`, {
      comment: {
        mutation: 'DELETE',
        data: deletedComment
      }
    });

    return deletedComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;

    const updatedComment = db.comments.find(comment => comment.id === id);

    if (!updatedComment) throw new Error('Comment not found');

    if (data.body) updatedComment.body = data.body;

    if (data.author) updatedComment.author = data.author;

    if (data.post) updatedComment.post = data.post;

    pubsub.publish(`POST.${updatedComment.post}.COMMENTS`, {
      comment: {
        mutation: 'UPDATE',
        data: updatedComment
      }
    });

    return updatedComment;
  }
};

export default mutation;
