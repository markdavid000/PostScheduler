import React from 'react'
import { ScheduledPost } from '../types/scheduledPost'

interface ScheduledPostsListProps {
  posts: ScheduledPost[]
}

export function ScheduledPostsList({ posts }: ScheduledPostsListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Scheduled Posts</h2>
      {posts.length === 0 ? (
        <p>No scheduled posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post, index) => (
            <li key={index} className="border p-4 rounded-md">
              <p className="font-semibold">{post.content}</p>
              <p className="text-sm text-gray-500">
                Scheduled for: {new Date(post.scheduledTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Visibility: {post.visibility}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

