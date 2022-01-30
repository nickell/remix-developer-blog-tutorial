import { useLoaderData, LoaderFunction, Link } from 'remix'
import { maybeGetPost, Post } from '~/posts'
import invariant from 'tiny-invariant'

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug')
  return maybeGetPost(params.slug)
}

function Post({ post }: { post: Post | null }) {
  if (!post) return <p>Can't find this post</p>

  return <div dangerouslySetInnerHTML={{ __html: post.html }} />
}

export default function PostPage() {
  const post = useLoaderData<Post | null>()

  return (
    <>
      <aside>
        <Link to="/posts">Back</Link>
      </aside>
      <article>
        <Post post={post} />
      </article>
    </>
  )
}
