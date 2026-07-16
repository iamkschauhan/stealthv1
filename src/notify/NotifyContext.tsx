import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_THREADS,
  type ChatMessage,
  type NotificationItem,
  type Thread,
} from './data'

type Ctx = {
  notifications: NotificationItem[]
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>
  threads: Thread[]
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>
  unreadMessages: number
  removeNotification: (id: string) => void
  clearNotificationActions: (id: string) => void
  deleteThread: (id: string) => void
  markThreadRead: (id: string) => void
  appendMessage: (threadId: string, message: ChatMessage) => void
}

const NotifyContext = createContext<Ctx | null>(null)

export function NotifyProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [threads, setThreads] = useState(INITIAL_THREADS)

  const unreadMessages = useMemo(
    () => threads.reduce((sum, t) => sum + t.unread, 0),
    [threads],
  )

  const removeNotification = useCallback(
    (id: string) => setNotifications((list) => list.filter((n) => n.id !== id)),
    [],
  )

  const clearNotificationActions = useCallback(
    (id: string) =>
      setNotifications((list) =>
        list.map((n) => (n.id === id ? { ...n, actions: undefined } : n)),
      ),
    [],
  )

  const deleteThread = useCallback(
    (id: string) => setThreads((list) => list.filter((t) => t.id !== id)),
    [],
  )

  const markThreadRead = useCallback(
    (id: string) =>
      setThreads((list) =>
        list.map((t) => (t.id === id ? { ...t, unread: 0 } : t)),
      ),
    [],
  )

  const appendMessage = useCallback((threadId: string, message: ChatMessage) => {
    setThreads((list) =>
      list.map((t) => {
        if (t.id !== threadId) return t
        return {
          ...t,
          messages: [...t.messages, message],
          lastSender: 'You',
          time: 'now',
          preview: message.text?.slice(0, 40) ?? 'Photo',
          unread: 0,
        }
      }),
    )
  }, [])

  const value: Ctx = {
    notifications,
    setNotifications,
    threads,
    setThreads,
    unreadMessages,
    removeNotification,
    clearNotificationActions,
    deleteThread,
    markThreadRead,
    appendMessage,
  }

  return <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>
}

export function useNotify() {
  const ctx = useContext(NotifyContext)
  if (!ctx) throw new Error('useNotify must be used within NotifyProvider')
  return ctx
}
