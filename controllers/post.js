const Post = require('../models/post');

exports.createPost = async (req, res, next) => {
	try {
		const url = req.protocol + "://" + req.get("host");
		const post = new Post({
		  title: req.body.title,
		  content: req.body.content,
		  imagePath: url + "/images/" + req.file.filename
		});
		post.save();
		res.status(201).send({
			message: 'Post created successfully!',
			post: post
		});
	} catch (err) {
		res.status(500).send({
			message: 'Post not created!',
			err: err
		});
	}
};

exports.getPost = async (req, res, next) => {
	try {
		const id = req.params.id;
		const post = await Post.findById({ _id: id });
		if (!post) {
			return res.status(404).send({
				message: 'Post not found!'
			});
		}
		res.status(200).send(post);
		// res.status(200).send({
		// 	message: 'Post found!',
		// 	post: post
		// });
	} catch (err) {
		res.status(500).send({
			message: 'Something not right!',
			err: err
		});
	}
};

exports.getPosts = async (req, res, next) => {
	try {
		const pageSize = +req.query.pagesize;
		const currentPage = +req.query.page;
		// console.log(req.query);
		// if(pageSize && currentPage) {
			const count = await Post.find().count()	
			const post = await Post.find()
			.skip(pageSize * (currentPage - 1))
			.limit(pageSize)
			.sort({ createdAt: -1 });
			if (!post || post.length == 0) {
				return res.status(404).send({
					message: 'No posts found!'
				});
			}
			res.status(200).send({
				message: 'All Posts!',
				post: post,
				count:count
			});
		// }		
	} catch (err) {
		res.status(500).send({
			message: 'Something not right!',
			err: err
		});
	}
};

exports.updatePost = async (req, res, next) => {
	try {
		const id = req.params.id;
		const title = req.body.title;
		const content = req.body.content;
		let imagePath = req.body.imagePath;

		if(req.file) {
			const url = req.protocol + '://' + req.get('host');
			imagePath = url + "/images/"+ req.file.filename
		}
		const post = new Post({
			title: title,
			content: content,
			imagePath: imagePath
		});
		const result = await Post.findByIdAndUpdate({ _id: id }, { $set: { title: title, content: content , imagePath:imagePath} });
		if (!result) {
			return res.status(404).send({
				message: 'Post not found!'
			});
		}
		// result.save();
		console.log(result);
		res.status(200).send({
			message: 'Post Updated!',
			post: post
		});
	} catch (err) {
		res.status(500).send({
			message: 'Something not right!',
			err: err.message
		});
	}
};

exports.deletePost = async (req, res, next) => {
	try {
		const id = req.params.id;
		const post = await Post.deleteOne({ _id: id });
		if (!post) {
			return res.status(401).send({
				message: 'Post not found!'
			});
		}
		// console.log('delete: ', post.deletedCount);
		if (post.n > 0) {
			return res.status(200).send({
				message: 'Post deleted!',
				post: post
			});
		}
	} catch (err) {
		res.status(500).send({
			message: 'Something not right!',
			err: err
		});
	}
};
