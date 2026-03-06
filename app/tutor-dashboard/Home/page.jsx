"use client";

import SearchBar from "../../../component/SearchBar";
import ScrollToTop from "../../../screens/scroll";
import { PostCard, VideoCard, posts, videoPost } from "../post/page";

export default function PostsSection() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <SearchBar />
      <ScrollToTop />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <VideoCard post={videoPost} />
    </div>
  );
}