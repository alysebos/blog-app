const express = require('express');
const morgan = require('morgan');

const app = express();

const BlogPostsRouter = require('./BlogPostsRouter');

// log the http layer
app.use(morgan('common'));

app.use('/blog-posts', BlogPostsRouter);

// Listen for requests
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});