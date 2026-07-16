import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../auth'
import type { AppNotification } from '../data/types'
import type { ChatMessage, NotificationItem, Thread } from './data'
import {
  handleNotifAction,
  hideChat,
  loadInbox,
  loadThreadList,
  loadThreadMessages,
  markChatRead,
  postChatMessage,
  removeInboxItem,
  resolvePlanPath,
} from './notifyActions'

const THREAD_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop'

type Ctx = {
  loading: boolean
  error: string | null
  notifications: NotificationItem[]
  rawNotifications: AppNotification[]
  threads: Thread[]
  unreadMessages: number
  refresh: () => Promise<void>
  removeNotification: (id: string) => Promise<void>
  runNotificationAction: (id: string, label: string) => Promise<void>
  deleteThread: (id: string) => Promise<void>
  markThreadRead: (id: string) => Promise<void>
  loadMessages: (threadId: string) => Promise<ChatMessage[]>
  sendChat: (
    threadId: string,
    text: string,
    imageBlobs?: Blob[],
  ) => Promise<void>
  viewPlanPath: (threadId: string) => Promise<string>
}

const NotifyContext = createContext<Ctx | null>(null)

export function NotifyProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [rawNotifications, setRaw] = useState<AppNotification[]>([])
  const [threads, setThreads] = useState<Thread[]>([])

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([])
      setRaw([])
      setThreads([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [inbox, threadList] = await Promise.all([
        loadInbox(user.uid),
        loadThreadList(user.uid),
      ])
      setRaw(inbox.raw)
      setNotifications(inbox.items)
      setThreads((prev) => {
        const msgMap = Object.fromEntries(prev.map((t) => [t.id, t.messages]))
        return threadList.map((t) => ({
          ...t,
          messages: msgMap[t.id] || t.messages,
        }))
      })
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to load inbox')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  const unreadMessages = useMemo(
    () => threads.reduce((sum, t) => sum + t.unread, 0),
    [threads],
  )

  const removeNotification = useCallback(
    async (id: string) => {
      await removeInboxItem(id)
      setNotifications((list) => list.filter((n) => n.id !== id))
      setRaw((list) => list.filter((n) => n.id !== id))
    },
    [],
  )

  const runNotificationAction = useCallback(
    async (id: string, label: string) => {
      if (!user) return
      const notif = rawNotifications.find((n) => n.id === id)
      if (!notif) return
      await handleNotifAction({
        notif,
        label,
        uid: user.uid,
        displayName: profile?.displayName,
        avatarUrl: profile?.avatarUrl,
      })
      await refresh()
    },
    [profile, rawNotifications, refresh, user],
  )

  const deleteThread = useCallback(
    async (id: string) => {
      if (!user) return
      await hideChat(id, user.uid)
      setThreads((list) => list.filter((t) => t.id !== id))
    },
    [user],
  )

  const markThreadRead = useCallback(
    async (id: string) => {
      if (!user) return
      await markChatRead(id, user.uid)
      setThreads((list) =>
        list.map((t) => (t.id === id ? { ...t, unread: 0 } : t)),
      )
    },
    [user],
  )

  const loadMessages = useCallback(
    async (threadId: string) => {
      if (!user) return []
      const msgs = await loadThreadMessages(threadId, user.uid)
      setThreads((list) => {
        const exists = list.some((t) => t.id === threadId)
        if (!exists) {
          return [
            ...list,
            {
              id: threadId,
              title: 'Plan chat',
              avatar: THREAD_AVATAR,
              lastSender: '',
              time: '',
              preview: '',
              unread: 0,
              planId: threadId,
              messages: msgs,
            },
          ]
        }
        return list.map((t) => (t.id === threadId ? { ...t, messages: msgs } : t))
      })
      return msgs
    },
    [user],
  )

  const sendChat = useCallback(
    async (threadId: string, text: string, imageBlobs?: Blob[]) => {
      if (!user) throw new Error('Sign in required')
      await postChatMessage({
        threadId,
        uid: user.uid,
        text: text || undefined,
        imageBlobs,
      })
      await loadMessages(threadId)
      await refresh()
    },
    [loadMessages, refresh, user],
  )

  const viewPlanPath = useCallback(
    async (threadId: string) => {
      if (!user) return '/plans'
      const t = threads.find((x) => x.id === threadId)
      const planId = t?.planId || threadId
      return resolvePlanPath(planId, user.uid)
    },
    [threads, user],
  )

  const value: Ctx = {
    loading,
    error,
    notifications,
    rawNotifications,
    threads,
    unreadMessages,
    refresh,
    removeNotification,
    runNotificationAction,
    deleteThread,
    markThreadRead,
    loadMessages,
    sendChat,
    viewPlanPath,
  }

  return <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>
}

export function useNotify() {
  const ctx = useContext(NotifyContext)
  if (!ctx) throw new Error('useNotify must be used within NotifyProvider')
  return ctx
}
