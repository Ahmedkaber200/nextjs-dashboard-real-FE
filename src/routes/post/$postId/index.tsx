import { createFileRoute, useSearch, } from '@tanstack/react-router'

export const Route = createFileRoute('/post/$postId/')({
  validateSearch: (search) => {
    return {
      page: Number(search.page ?? 1),  // default to 1 if not provided
    }
  },
  component: PostDetail,
})

function PostDetail() {
  const { postId } = Route.useParams();
  const  { page } = Route.useSearch()
  return <div>Hello "/post/$postId/"! ID: {postId} {page}</div>
}