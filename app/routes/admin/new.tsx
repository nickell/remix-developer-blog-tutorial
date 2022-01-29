import {
  useTransition,
  useActionData,
  redirect,
  Form,
  ActionFunction,
} from 'remix'
import { createPost } from '~/posts'
import invariant from 'tiny-invariant'

type PostError = {
  title?: boolean
  slug?: boolean
  markdown?: boolean
  date?: boolean
}

export const action: ActionFunction = async ({ request }) => {
  await new Promise(res => setTimeout(res, 1000))
  const formData = await request.formData()

  const title = formData.get('title')
  const slug = formData.get('slug')
  const date = formData.get('date')
  const markdown = formData.get('markdown')

  const errors: PostError = {}
  if (!title) errors.title = true
  if (!slug) errors.slug = true
  if (!markdown) errors.markdown = true
  if (!date) errors.date = true

  if (Object.keys(errors).length) {
    return errors
  }

  invariant(typeof title === 'string')
  invariant(typeof slug === 'string')
  invariant(typeof markdown === 'string')
  invariant(typeof date === 'string')

  await createPost({ title, slug, markdown, date })

  return redirect('/admin')
}

export default function NewPost() {
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title ? <em>Title is required</em> : null}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
          <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label>
          Post Date: {errors?.date ? <em>Date is required</em> : null}
          <input type="text" name="date" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{' '}
        {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea rows={20} name="markdown" />
      </p>
      <p>
        <button type="submit">Create Post</button>
      </p>
    </Form>
  )
}
