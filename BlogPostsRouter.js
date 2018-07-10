const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create("What is Lorem Ipsum?", `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, "User 1");

BlogPosts.create("Why do we use it?", `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`, "User 2");

// Create GET endpoint
router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

// Create POST endpoint
router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `missing '${field}' in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if ('publishDate' in req.body) {
		const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
		res.status(201).json(item);
	} else {
		const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
		res.status(201).json(item);
	}
});

// Create PUT endpoint
router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['id', 'title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post id '${req.params.id}'`);
	BlogPosts.update({
		id: req.body.id,
		title: req.body.title,
		author: req.body.author,
		content: req.body.content,
		publishDate: req.body.publishDate || Date.now()
	});
	res.status(204).end();
});

// Create DELETE endpoint
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post item \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;