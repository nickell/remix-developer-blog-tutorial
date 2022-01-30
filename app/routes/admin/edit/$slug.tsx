import {
  useTransition,
  useActionData,
  useLoaderData,
  LoaderFunction,
  Form,
  ActionFunction,
} from 'remix'
import { getPost, removePost } from '~/posts'
import invariant from 'tiny-invariant'
import { action as newPostAction } from '~/routes/admin/new'

type LoaderData = Awaited<ReturnType<typeof getPost>>

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug')
  return getPost(params.slug)
}

export const action: ActionFunction = async props => {
  invariant(props.params.slug, 'expected params.slug')

  await removePost(props.params.slug)

  return newPostAction(props)
}

export default function PostEdit() {
  const post = useLoaderData<LoaderData>()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <>
      <Form method="post" key={post.slug}>
        <p>
          <label>
            Post Title: {errors?.title ? <em>Title is required</em> : null}
            <input type="text" name="title" defaultValue={post.title} />
          </label>
        </p>
        <p>
          <label>
            Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
            <input type="text" name="slug" defaultValue={post.slug} />
          </label>
        </p>
        <p>
          <label>
            Post Date: {errors?.date ? <em>Date is required</em> : null}
            <input type="date" name="date" defaultValue={post.date} />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">Markdown:</label>{' '}
          {errors?.markdown ? <em>Markdown is required</em> : null}
          <br />
          <textarea rows={20} name="markdown" defaultValue={post.markdown} />
        </p>
        <p>
          <button type="submit">
            {transition.submission ? 'Saving...' : 'Save Post'}
          </button>
        </p>
        <p>
          <button type="submit" form="removePost">
            Remove
          </button>
        </p>
      </Form>
      <Form
        id="removePost"
        method="post"
        action={`/admin/remove/${post.slug}`}
      />
    </>
  )
}
