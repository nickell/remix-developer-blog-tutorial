import {
  useTransition,
  useActionData,
  useLoaderData,
  LoaderFunction,
  Form,
  ActionFunction,
} from 'remix'
import { JsonPost, getPost, removePost } from '~/posts'
import invariant from 'tiny-invariant'
import { action as newPostAction } from '~/routes/admin/new'

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug')
  return getPost(params.slug)
}

export const action: ActionFunction = async props => {
  await new Promise(res => setTimeout(res, 1000))

  invariant(props.params.slug, 'expected params.slug')

  await removePost(props.params.slug)

  return newPostAction(props)
}

export default function PostEdit() {
  const post = useLoaderData<JsonPost>()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Form method="post">
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
          <input type="text" name="date" defaultValue={post.date} />
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
          {transition.submission ? 'Creating...' : 'Create Post'}
        </button>
      </p>
    </Form>
  )
}
