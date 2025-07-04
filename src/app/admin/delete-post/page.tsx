
'use client';

import React, { useState, useEffect } from 'react';

interface Post {
  slug: string;
  title: string;
}

export default function DeletePostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data.posts));
  }, []);

  const handleDelete = async () => {
    setError('');
    setSuccess('');

    if (!selectedPost) {
      setError('Please select a post to delete.');
      return;
    }

    if (!apiKey) {
      setError('Please enter your API key.');
      return;
    }

    try {
      const res = await fetch('/api/delete-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ slug: selectedPost }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete post');
      }

      setSuccess('Post deleted successfully!');
      // Refresh the posts list
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => setPosts(data.posts));
      setSelectedPost('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-12 mb-12">
      <h1 className="text-3xl font-bold mb-6">Delete Post</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="mb-4">
        <label htmlFor="post-select" className="block mb-2">Select a post to delete:</label>
       <select
  id="post-select"
  value={selectedPost}
  onChange={e => setSelectedPost(e.target.value)}
  className="w-full p-2 border border-gray-300 rounded bg-gray-500 text-white"
>
  <option value="">-- Select a post --</option>
  {posts.map(post => (
    <option key={post.slug} value={post.slug}>
      {post.title}
    </option>
  ))}
</select>

      </div>
      <div className="mb-4">
        <label htmlFor="api-key" className="block mb-2">API Key:</label>
        <input
          type="password"
          id="api-key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete Post
      </button>
    </div>
  );
}
