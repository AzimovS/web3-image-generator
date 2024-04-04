"use client";

import { useEffect, useState } from "react";
import { Loader } from "./imagegen/_components/Loader";
import type { NextPage } from "next";
import Card from "~~/components/Card";
import { Post } from "~~/types/utils";

interface RenderCardsProps {
  data: Post[];
  title: string;
}

const RenderCards: React.FC<RenderCardsProps> = ({ data, title }) => {
  if (data?.length > 0) return data.map(post => <Card key={post._id} {...post} />);

  return <h2 className="mt-5 font-bold text-[#6469ff] text-xs uppercase">{title}</h2>;
};

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const [searchText, setSearchText] = useState<string>("");
  const [searchedResults, setSearchedResults] = useState<Post[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/post", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchTimeout!);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter(
          item =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase()),
        );
        setSearchedResults(searchResults);
      }, 500),
    );
  };

  return (
    <>
      <section className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-center">
            <span className="mt-10 block text-4xl font-bold">The Community Showcase</span>
          </h1>
          <p className="text-center block text-[#666e75] text-[14px]">
            Browse through a collection of imaginative and visually stunning images genereated by AI
          </p>
        </div>

        <div className="mt-5 text-center">
          <input
            type="text"
            name="text"
            className="border-primary bg-base-100 text-base-content p-2 mr-2 w-full md:w-1/2 lg:w-2/3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Search prompt or address"
            value={searchText}
            onChange={handleSearchChange}
            required
          />
        </div>

        <div className="mt-10 max-w-4xl">
          {loading ? (
            <div className="flex justify-center items-center">
              {" "}
              <Loader />{" "}
            </div>
          ) : (
            <>
              {searchText && (
                <h2 className="font-medium text-[#666e75] text-xl mb-3">
                  Showing results for <span className="text-[#222328]">{searchText}</span>
                </h2>
              )}
              <div className="grid lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 grid-cols-1 gap-3">
                {searchText ? (
                  <RenderCards data={searchedResults} title="No search results found" />
                ) : (
                  <RenderCards data={allPosts} title="No posts found" />
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
