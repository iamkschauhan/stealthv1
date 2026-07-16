import { Route, Routes } from 'react-router-dom'
import { NotificationsPage } from './NotificationsPage'
import { MessagesPage } from './MessagesPage'
import { ChatPage } from './ChatPage'

export function NotificationRoutes() {
  return (
    <Routes>
      <Route index element={<NotificationsPage />} />
    </Routes>
  )
}

export function MessageRoutes() {
  return (
    <Routes>
      <Route index element={<MessagesPage />} />
      <Route path=":threadId" element={<ChatPage />} />
    </Routes>
  )
}
