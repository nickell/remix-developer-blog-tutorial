import { useLoaderData, LoaderFunction, useCatch, useParams } from 'remix'
import { getPost, PostNotFoundResponse } from '~/posts'
import invariant from 'tiny-invariant'

type LoaderData = Awaited<ReturnType<typeof getPost>>

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug')
  return getPost(params.slug)
}

export default function PostPage() {
  const post = useLoaderData<LoaderData>()

  return (
    <article>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
}

export function CatchBoundary() {
  const caught = useCatch<PostNotFoundResponse>()
  const params = useParams()
  invariant(params.slug, 'expected params.slug')

  if (caught.status !== 404) {
    throw new Error('Unknown status in catch boundary')
  }

  return <p>Post {params.slug} not found</p>
}
