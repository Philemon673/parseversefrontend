"use client";

import SearchBar from "../../../mentor-component/searchbar";
import ScrollToTop from "../../../screens/scroll";
import CommunityFeed from "@/component/CommunityFeed";

export default function PostsSection() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <SearchBar />
      <h3 className="font-black text-slate-800 text-sm px-1">Feeds</h3>
      <CommunityFeed />
      <ScrollToTop />
    </div>
  );
}