export interface ScheduledPost {
    id: string
    address: string
    contentURI: string
    visibility: string
    scheduledTime: number
    content: string
    status: 'scheduled' | 'published' | 'failed'
  }
  
  