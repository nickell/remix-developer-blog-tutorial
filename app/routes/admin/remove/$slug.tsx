import { ActionFunction, redirect } from 'remix'
import { removePost } from '~/posts'
import invariant from 'tiny-invariant'

export const action: ActionFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug')

  await removePost(params.slug)

  return redirect('/admin')
}

export default function RemovePost() {
  return null
}
