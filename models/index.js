const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

//users can make many posts
User.hasMany(Post, {
    foreignKey: 'user_id',
});
//post can can only belong to one user
Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
//a comment can only belong to one user
Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
//a comment can only belong to one post
Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});
//a user can make many comments
User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
//a post has many comments
Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

//export all 3
module.exports = { User, Post, Comment };