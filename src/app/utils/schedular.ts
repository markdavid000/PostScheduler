import { createPostTypedData } from './lens'
import { ScheduledPost } from '../types/scheduledPost'

const STORAGE_KEY = 'LENS_SCHEDULED_POSTS'

export const schedulePost = async (address: string, contentURI: string, visibility: string, scheduledTime: number, content: string): Promise<ScheduledPost> => {
  const newPost: ScheduledPost = { id: Date.now().toString(), address, contentURI, visibility, scheduledTime, content, status: 'scheduled' }
  const posts = await getScheduledPosts(address)
  posts.push(newPost)
  await saveScheduledPosts(address, posts)
  console.log(`Post scheduled for ${new Date(scheduledTime).toLocaleString()}`)
  return newPost
}

export const getScheduledPosts = async (address: string): Promise<ScheduledPost[]> => {
  const posts = localStorage.getItem(`${STORAGE_KEY}_${address}`)
  return posts ? JSON.parse(posts) : []
}

export const saveScheduledPosts = async (address: string, posts: ScheduledPost[]) => {
  localStorage.setItem(`${STORAGE_KEY}_${address}`, JSON.stringify(posts))
}

export const checkScheduledPosts = async (address: string): Promise<ScheduledPost[]> => {
  const now = Date.now()
  const posts = await getScheduledPosts(address)
  const updatedPosts = await Promise.all(posts.map(async (post) => {
    if (post.scheduledTime <= now && post.status === 'scheduled') {
      try {
        await createPostTypedData(post.address, post.content, post.visibility)
        post.status = 'published'
        console.log(`Post published for ${post.address}`)
      } catch (error) {
        console.error(`Failed to publish post for ${post.address}:`, error)
        post.status = 'failed'
      }
    }
    return post
  }))

  await saveScheduledPosts(address, updatedPosts)
  return updatedPosts
}

export const clearPublishedAndFailedPosts = async (address: string) => {
  const posts = await getScheduledPosts(address)
  const updatedPosts = posts.filter(post => post.status === 'scheduled')
  await saveScheduledPosts(address, updatedPosts)
}

export const deleteScheduledPost = async (address: string, postId: string) => {
  const posts = await getScheduledPosts(address)
  const updatedPosts = posts.filter(post => post.id !== postId)
  await saveScheduledPosts(address, updatedPosts)
}

