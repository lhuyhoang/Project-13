const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Tiêu đề phải có ít nhất 5 ký tự"],
      maxlength: [150, "Tiêu đề không được vượt quá 150 ký tự"],
    },
    content: {
      type: String,
      required: true,
      minlength: [20, "Nội dung phải có ít nhất 20 ký tự"],
    },
    summary: {
      type: String,
      maxlength: [300, "Tóm tắt không được vượt quá 300 ký tự"],
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Công nghệ",
        "Giải trí",
        "Thể thao",
        "Kinh doanh",
        "Sức khỏe",
        "Khác",
      ],
      default: "Khác",
    },
    coverImage: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
    // Virtuals để tính toán số lượng bình luận
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual để đếm số lượng like
postSchema.virtual("likeCount").get(function () {
 return (this.likes || []).length;
});

// Tối ưu tìm kiếm theo title, category và tag
postSchema.index({ title: "text", category: 1 });
postSchema.index({ category: 1 });
postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
