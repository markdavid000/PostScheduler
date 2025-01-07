'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select'
import { toaster } from '@/components/ui/toaster'
import { storeContentOnIPFS } from '../utils/ipfs'
import { schedulePost, getScheduledPosts, checkScheduledPosts, clearPublishedAndFailedPosts, deleteScheduledPost } from '../utils/schedular'
import { useAccount, useWalletClient } from "wagmi"
import { createListCollection, Input, Textarea } from '@chakra-ui/react'
import { ScheduledPost } from '../types/scheduledPost'
import { FiCalendar, FiClock, FiEye, FiSend, FiTrash2 } from 'react-icons/fi'
import { authenticate } from '../utils/auth'

export function EnhancedPostScheduler() {
  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState<string[]>(['PUBLIC'])
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    const init = async () => {
      if (address && walletClient) {
        try {
          await authenticate(address, walletClient);
          await fetchScheduledPosts();
        } catch (error) {
          console.error('Authentication failed:', error);
          toaster.create({
            title: 'Error',
            description: 'Failed to authenticate with Lens',
            type: 'error'
          });
        }
      }
    };

    init();

    const interval = setInterval(async () => {
      if (address) {
        await checkScheduledPosts(address);
        await fetchScheduledPosts();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [address, walletClient]);

  const fetchScheduledPosts = async () => {
    if (address) {
      const posts = await getScheduledPosts(address);
      setScheduledPosts(posts);
    }
  };

  const handleSchedulePost = async () => {
    if (!address) {
      toaster.create({
        title: 'Error',
        description: 'Please connect your wallet first',
        type: 'error'
      })
      return
    }

    setIsScheduling(true)
    try {
      if (!content || !scheduleDate || !scheduleTime) {
        throw new Error('Please fill in all fields')
      }

      const scheduledTime = new Date(`${scheduleDate}T${scheduleTime}`).getTime()
      const currentTime = new Date().getTime()
      if (scheduledTime <= currentTime) {
        throw new Error('Scheduled time must be in the future')
      }

      const contentURI = await storeContentOnIPFS(content)

      const newPost = await schedulePost(address, contentURI, visibility[0], scheduledTime, content)

      setScheduledPosts(prevPosts => [...prevPosts, newPost])

      toaster.create({
        title: 'Post Scheduled',
        description: `Your post has been scheduled for ${scheduleDate} at ${scheduleTime}`,
        type: 'success'
      })

      setContent('')
      setScheduleDate('')
      setScheduleTime('')
      setVisibility(['PUBLIC'])
    } catch (error) {
      console.error('Failed to schedule post:', error)
      toaster.create({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        type: 'error'
      })
    } finally {
      setIsScheduling(false)
    }
  }

  const handleClearPublishedAndFailed = async () => {
    if (address) {
      await clearPublishedAndFailedPosts(address)
      await fetchScheduledPosts()
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (address) {
      await deleteScheduledPost(address, postId)
      await fetchScheduledPosts()
    }
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="w-full max-w-4xl p-8 bg-gradient-to-br from-purple-700 to-indigo-900 rounded-xl shadow-2xl ">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">Lens Post Scheduler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            className="w-full p-4 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows={5}
          />
          <SelectRoot 
            collection={visibilities}
            size="md"
            value={visibility}
            onValueChange={(value: any) => setVisibility(value)}
            className="w-full"
          >
            <SelectTrigger className="w-full p-4 bg-white bg-opacity-20 rounded-lg text-white">
              <SelectValueText placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent className="bg-purple-800 text-white">
              {visibilities.items.map((item) => (
                <SelectItem item={item} key={item.value} className="hover:bg-purple-700">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
              <Input
                type="date"
                value={scheduleDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduleDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="relative flex-1">
              <FiClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduleTime(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
          <Button 
            onClick={handleSchedulePost} 
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400" 
            disabled={isScheduling}
          >
            {isScheduling ? 'Scheduling...' : 'Schedule Post'}
          </Button>
        </div>
        <div className="bg-white bg-opacity-10 p-6 rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold mb-4 text-white">Scheduled Posts</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
            <AnimatePresence>
              {scheduledPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white bg-opacity-20 p-4 rounded-lg relative"
                >
                  <p className="text-white mb-2">{post.content}</p>
                  <div className="flex justify-between text-sm text-purple-200">
                    <span>{new Date(post.scheduledTime).toLocaleString()}</span>
                    <span className="flex items-center">
                      <FiEye className="mr-1" />
                      {post.visibility}
                    </span>
                  </div>
                  <div className={`mt-2 text-sm ${post.status === 'published' ? 'text-green-400' : post.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
                    Status: {post.status}
                  </div>
                  {post.status === 'scheduled' && (
                    <Button
                      onClick={() => handleDeletePost(post.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <Button
            onClick={handleClearPublishedAndFailed}
            className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Clear Published and Failed Posts
          </Button>
        </div>
      </div>
      </div>
    </div>
  )
}

const visibilities = createListCollection({
  items: [
    { label: "Public", value: "PUBLIC" },
    { label: "Followers", value: "FOLLOWERS" },
    { label: "Collectors", value: "COLLECTORS" },
  ],
})

