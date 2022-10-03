---
layout: "../../layouts/BlogPostLayout.astro"
title: Absinthe Dataloader Sources
publishDate: 30 September 2022
description: Managing dataloader sources for your elixir GraphQL API
tags: ["elixir", "graphql", "absinthe", "dataloader"]
---

To avoid the GraphQL-Typical N+1 problem, absinthe offers the `dataloader` package, named after its JS counterpart.

## The 80 Percent Solution

Most relations can be solved like this:

```elixir
Dataloader.new()
|> Dataloader.add_source(Repo, Dataloader.Ecto.new(Repo))
```

Initializing this loader and providing it to the _Context_ allows us to resolve most ecto-native relations in a manner similar to this:

```elixir
object :post do
  field :title, non_null(:string)
  field :comments, list_of(:comment), resolve: dataloader(Repo)
end
```

For most of our needs, creating a single `Repo` source will suffice and save us huge amounts of time.
However, once in a while we will need to do some _preprocessing_ of sorts, or to set some _preload_ defaults, filter deleted records or what not.
This is where context datasources come into play.

## Context-Specific Datasources

To create your own _Datasource_, you'll need to define your own `%Dataloader.Ecto.Source{}` and specify the resolver/query function you wnat it to run.

Within this query function (usually `query/2`) you can then match on the **Struct** and **Context** to adjust the default query used by _dataloader_.

```elixir
def datasource(), do: Dataloader.Ecto.Source(Repo, query: &query/2)

def query(Post, _), do: from(p in Post, where: is_nil(p.deleted_at)), preload: [:comments]

def query(queryable, _), do: queryable
```

Now, if we want to have a `:author` object with a list of posts, and only want to include the not-deleted ones, we can resolve it in our schema with the new Post datasource.

```elixir
object :author do
  field :posts, list_of(:post), resolve: dataloader(MyApp.Posts)
end
```
