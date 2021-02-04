import React from "react";

export default function Post({ post }) {
	return post ? <li className="post">{post.post_title}</li> : null;
}
