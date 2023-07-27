import User from "../models/schemas/user.model";
import Post from "../models/schemas/post.model";

export default class PostController {
  static async createPost(req: any, res: any) {
    try {
      const user = await User.findOne({ _id: req.body.user_id });
      if (!user) {
        res.json({
          message:
            "Người dùng không tồn tại, vui lòng đăng nhập để sử dụng dịch vụ !",
        });
      } else if (!req.body.imgUrl) {
        res.json({
          message: "Đây là dịch vụ chia sẻ ảnh, hãy vui lòng đăng tải ảnh !",
        });
      } else {
        const { description, createAt, imgUrl } = req.body;
        const post = new Post({ description, createAt, imgUrl });
        post.user = user._id;
        await post.save();
        user.posts.push({ post: post._id });
        await user.save();
        res.json({
          post: await Post.findOne({ _id: post._id }).populate("user"),
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  static async getAllPosts(req: any, res: any) {
    const posts = await Post.find().populate("user");
    const data = posts.reverse();
    res.json({ posts: data });
  }

  static async getPostDetail(req: any, res: any) {
    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate("comments.postedBy");
    res.json({ post });
  }

  static async postComment(req: any, res: any) {
    try {
      const { user, comment } = req.body;
      const post = await Post.findOne({ _id: req.params.id });
      const userPosted = await User.findOne({ _id: user._id });

      if (comment.length < 1) {
        res.json({ message: "Vui lòng nhập nội dung!" });
      } else if (post && userPosted) {
        await Post.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              comments: {
                comment: comment,
                postedBy: user._id,
              },
            },
          },
          { new: true }
        );

        const fePost: any = await Post.findById(req.params.id).populate(
          "comments.postedBy"
        );
        return res.json({ data: fePost.comments });
      } else {
        res.json({ message: "Người dùng hoặc bài viết không tồn tại!" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async likeOrUnlike(req: any, res: any) {
    try {
      const user: any = await User.findOne({ _id: req.body.user_id });
      const post: any = await Post.findOne({ _id: req.body.postId }).populate(
        "likes"
      );
      let message;
      if (user && post) {
        const hasLiked = post.likes.some(
          (like) => like.user._id.toString() === user._id.toString()
        );
        if (hasLiked) {
          post.likes = post.likes.filter(
            (like) => like.user._id.toString() !== user._id.toString()
          );
          message = "unlike";
        } else {
          post.likes.push({ user: user._id });
          message = "like";
        }
        await post.save();
        const newPost = await Post.findOne({ _id: post._id }).populate("user");
        res.json({
          message: message,
          post: newPost,
        });
      } else {
        res.json({
          message:
            "Người dùng không tồn tại, vui lòng đăng nhập để sử dụng dịch vụ !",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  static async savePost(req: any, res: any) {
    try {
      const user: any = await User.findOne({ _id: req.body.user_id });
      const post: any = await Post.findOne({ _id: req.body.postId }).populate(
        "likes"
      );
      let message;
      if (user && post) {
        const hasSaved = post.saved.some(
          (save) => save.user._id.toString() === user._id.toString()
        );
        if (hasSaved) {
          post.saved = post.saved.filter(
            (save) => save.user._id.toString() !== user._id.toString()
          );
          message = "unsave";
        } else {
          post.saved.push({ user: user._id });
          message = "save";
        }
        await post.save();
        const newPost = await Post.findOne({ _id: post._id }).populate("user");
        res.json({
          message: message,
          post: newPost,
        });
      } else {
        res.json({
          message:
            "Người dùng không tồn tại, vui lòng đăng nhập để sử dụng dịch vụ !",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async pagination(req: any, res: any) {
    const limit = 10;
    const page = req.params.id;
    const offset = Math.ceil((page - 1) * limit);
    const posts = await Post.find()
      .sort({ createAt: -1 })
      .limit(limit)
      .skip(offset)
      .populate("user");
    return res.json({ posts: posts });
  }
}
