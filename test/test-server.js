const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog Post", function() {
	// start the server before running tests
	before(function() {
		return runServer();
	});

	// close the server after running tests
	after(function() {
		return closeServer();
	});

	it("Should list all blog posts on GET", function() {
		return chai
			.request(app)
			.get("/blog-posts")
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a("array");
				expect(res.body.length).to.be.at.least(1);
				const expectedKeys = ["id", "title", "content", "author", "publishDate"]
				res.body.forEach(function(item) {
					expect(item).to.be.a("object");
					expect(item).to.include.keys(expectedKeys);
				});
			});
	});

	it("Should add new blog posts on POST", function() {
		const newBlogPost = {
			title: "A dumb blog entry",
			content: "This dumb blog entry is pretty dumb",
			author: "Test Bot"
		};
		return chai
			.request(app)
			.post("/blog-posts")
			.send(newBlogPost)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a("object");
				expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
				expect(res.body).to.not.equal(null);
				expect(res.body).to.deep.equal(
					Object.assign(newBlogPost, { id: res.body.id, publishDate: res.body.publishDate })
				);
			});
	});

	it("Should update items on PUT", function() {
		const updateData = {
			title: "Updated Title",
			content: "Updated Content",
			author: "Updated Author"
		}

		return (
			chai
				.request(app)
				.get("/blog-posts")
				.then(function(res) {
					updateData.id = res.body[0].id;
					return chai
						.request(app)
						.put(`/blog-posts/${updateData.id}`)
						.send(updateData);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
				})
			);
	});

	it("Should delete items on DELETE", function() {
		return (
			chai
				.request(app)
				.get("/blog-posts")
				.then(function(res) {
					return chai
						.request(app)
						.delete(`/blog-posts/${res.body[0].id}`);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
				})
			)
	})
})