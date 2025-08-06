// src/routes/post/_layout.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/post')({
  component: PostLayout,
})

function PostLayout() {
  return (
    <div>
      <h2>Post Layout Header</h2>
      <Outlet />
      <h2>Post Layout Footer</h2>
    </div>
  )
}
