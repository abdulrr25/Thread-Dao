"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Clock, Users } from "lucide-react";
import ThreadPost from "@/components/ThreadPost";

const SemanticSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const mockResults = [
        {
          id: "1",
          type: "post",
          author: {
            name: "Alex Rodriguez",
            handle: "alexr",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          },
          content:
            "Just published my thoughts on DAOs and the future of work. This is all about decentralized autonomous organizations.",
          createdAt: "3 hours ago",
          likes: 24,
          comments: 5,
          shares: 2,
          daoMembers: 48,
          semanticRelevance: 0.92,
        },
        {
          id: "2",
          type: "dao",
          name: "FutureWorkDAO",
          description:
            "Exploring decentralized work structures and remote collaboration in DAOs",
          members: 156,
          posts: 78,
          created: "2 months ago",
          category: "Work",
          semanticRelevance: 0.85,
        },
        {
          id: "3",
          type: "post",
          author: {
            name: "Sarah Chen",
            handle: "sarahc",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          },
          content:
            "The evolution of DAOs has been fascinating to watch. From simple voting mechanisms to complex governance structures.",
          createdAt: "2 days ago",
          likes: 56,
          comments: 12,
          shares: 8,
          daoMembers: 130,
          semanticRelevance: 0.78,
        },
      ];

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="semantic-search" />

      <main className="flex-1 border-l border-muted/30">
        <div className="container max-w-6xl py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Semantic Search</h1>
            <p className="text-muted-foreground">
              Find content based on meaning, not just keywords
            </p>
          </div>

          {/* Search Input */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <Sparkles className="text-primary h-5 w-5" />
                  <span className="text-sm text-muted-foreground">
                    Powered by AI - search by concepts and meaning
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Describe what you're looking for in natural language..."
                      className="pl-10 bg-muted/40"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className="bg-thread-gradient hover:opacity-90"
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>

                {/* Suggested Searches */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground mr-2">Try:</span>
                  {[
                    "DAOs with active governance",
                    "Posts about token economics",
                    "Communities focused on NFT art",
                  ].map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted/60"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        handleSearch();
                      }}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Search Results</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Sort by:</span>
                  <select className="bg-transparent border-none focus:outline-none">
                    <option>Relevance</option>
                    <option>Date</option>
                    <option>Popularity</option>
                  </select>
                </div>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="daos">DAOs</TabsTrigger>
                  <TabsTrigger value="people">People</TabsTrigger>
                </TabsList>

                {/* All Results */}
                <TabsContent value="all">
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <div key={result.id} className="relative">
                        {result.type === "post" ? (
                          <ThreadPost
                            id={result.id}
                            author={result.author}
                            content={result.content}
                            createdAt={result.createdAt}
                            likes={result.likes}
                            comments={result.comments}
                            shares={result.shares}
                            daoMembers={result.daoMembers}
                          />
                        ) : (
                          <Card className="overflow-hidden">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-thread-gradient flex items-center justify-center">
                                  <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{result.name}</h3>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {result.members} members
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      Created {result.created}
                                    </span>
                                  </div>
                                </div>
                                <Badge className="ml-auto">{result.category}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">{result.description}</p>
                              <Button size="sm" className="bg-thread-gradient hover:opacity-90">
                                View DAO
                              </Button>
                            </CardContent>
                          </Card>
                        )}

                        <Badge className="absolute top-3 right-3 bg-primary/10 text-primary text-xs">
                          {Math.round(result.semanticRelevance * 100)}% match
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Posts */}
                <TabsContent value="posts">
                  <div className="space-y-4">
                    {searchResults
                      .filter((r) => r.type === "post")
                      .map((result) => (
                        <div key={result.id} className="relative">
                          <ThreadPost
                            id={result.id}
                            author={result.author}
                            content={result.content}
                            createdAt={result.createdAt}
                            likes={result.likes}
                            comments={result.comments}
                            shares={result.shares}
                            daoMembers={result.daoMembers}
                          />
                          <Badge className="absolute top-3 right-3 bg-primary/10 text-primary text-xs">
                            {Math.round(result.semanticRelevance * 100)}% match
                          </Badge>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                {/* DAOs */}
                <TabsContent value="daos">
                  <div className="space-y-4">
                    {searchResults
                      .filter((r) => r.type === "dao")
                      .map((result) => (
                        <div key={result.id} className="relative">
                          <Card className="overflow-hidden">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-thread-gradient flex items-center justify-center">
                                  <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{result.name}</h3>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {result.members} members
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      Created {result.created}
                                    </span>
                                  </div>
                                </div>
                                <Badge className="ml-auto">{result.category}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">{result.description}</p>
                              <Button size="sm" className="bg-thread-gradient hover:opacity-90">
                                View DAO
                              </Button>
                            </CardContent>
                          </Card>
                          <Badge className="absolute top-3 right-3 bg-primary/10 text-primary text-xs">
                            {Math.round(result.semanticRelevance * 100)}% match
                          </Badge>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                {/* People (no results for now) */}
                <TabsContent value="people">
                  <div className="text-center py-12 text-muted-foreground">
                    No people results found for this query
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}

          {/* No Results / Empty States */}
          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query or browse recent content
              </p>
            </div>
          )}

          {!searchQuery && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Enter a search query</h3>
              <p className="text-muted-foreground">
                Use natural language to find exactly what you're looking for
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SemanticSearch;
