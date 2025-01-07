// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
// import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select'
// import { toaster } from '@/components/ui/toaster'
// import { storeContentOnIPFS } from '../utils/ipfs'
// import { schedulePost, getScheduledPosts, checkScheduledPosts } from '../utils/schedular'
// import { useAccount } from "wagmi"
// import { createListCollection, Input } from '@chakra-ui/react'
// import { ScheduledPostsList } from './ScheduledPostsList'
// import { ScheduledPost } from '../types/scheduledPost'

// export function PostScheduler() {
//   const [content, setContent] = useState('')
//   const [visibility, setVisibility] = useState<string[]>(['PUBLIC'])
//   const [scheduleDate, setScheduleDate] = useState('')
//   const [scheduleTime, setScheduleTime] = useState('')
//   const [isScheduling, setIsScheduling] = useState(false)
//   const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
//   const { address } = useAccount()

//   useEffect(() => {
//     const fetchScheduledPosts = async () => {
//       const posts = await getScheduledPosts(address)
//       setScheduledPosts(posts)
//     }

//     fetchScheduledPosts()

//     const interval = setInterval(async () => {
//       await checkScheduledPosts(address)
//       fetchScheduledPosts()
//     }, 60000) // Check every minute

//     return () => clearInterval(interval)
//   }, [])

//   const handleSchedulePost = async () => {
//     if (!address) {
//       toaster.create({
//         title: 'Error',
//         description: 'Please connect your wallet first',
//         type: 'error'
//       })
//       return
//     }

//     setIsScheduling(true)
//     try {
//       if (!content || !scheduleDate || !scheduleTime) {
//         throw new Error('Please fill in all fields')
//       }

//       const scheduledTime = new Date(`${scheduleDate}T${scheduleTime}`).getTime()
//       const currentTime = new Date().getTime()
//       if (scheduledTime <= currentTime) {
//         throw new Error('Scheduled time must be in the future')
//       }

//       const contentURI = await storeContentOnIPFS(content)

//       const newPost = await schedulePost(address, contentURI, visibility[0], scheduledTime, content)

//       setScheduledPosts(prevPosts => [...prevPosts, newPost])

//       toaster.create({
//         title: 'Post Scheduled',
//         description: `Your post has been scheduled for ${scheduleDate} at ${scheduleTime}`,
//         type: 'success'
//       })

//       setContent('')
//       setScheduleDate('')
//       setScheduleTime('')
//       setVisibility(['PUBLIC'])
//     } catch (error) {
//       console.error('Failed to schedule post:', error)
//       toaster.create({
//         title: 'Error',
//         description: error instanceof Error ? error.message : 'An unknown error occurred',
//         type: 'error'
//       })
//     } finally {
//       setIsScheduling(false)
//     }
//   }

//   return (
//     <div className="w-full max-w-md space-y-4">
//       <Input
//         placeholder="What's on your mind?"
//         value={content}
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
//       />
//       <SelectRoot 
//         collection={visibilities}
//         size="sm"
//         width="320px"
//         value={visibility}
//         onValueChange={(value: any) => setVisibility(value)}
//       >
//         <SelectTrigger>
//           <SelectValueText placeholder="Select visibility" />
//         </SelectTrigger>
//         <SelectContent>
//           {visibilities.items.map((item) => (
//             <SelectItem item={item} key={item.value}>
//               {item.label}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </SelectRoot>
//       <Input
//         type="date"
//         value={scheduleDate}
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduleDate(e.target.value)}
//       />
//       <Input
//         type="time"
//         value={scheduleTime}
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduleTime(e.target.value)}
//       />
//       <Button onClick={handleSchedulePost} className="w-full" disabled={isScheduling}>
//         {isScheduling ? 'Scheduling...' : 'Schedule Post'}
//       </Button>
//       <ScheduledPostsList posts={scheduledPosts} />
//     </div>
//   )
// }

// const visibilities = createListCollection({
//   items: [
//     { label: "Public", value: "PUBLIC" },
//     { label: "Followers", value: "FOLLOWERS" },
//     { label: "Collectors", value: "COLLECTORS" },
//   ],
// })

