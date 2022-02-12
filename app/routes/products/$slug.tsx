import { useLoaderData, useCatch } from 'remix'
import invariant from 'tiny-invariant'
import { getProduct } from '~/products'
import { useParam } from '~/hooks'

export async function loader({ params }) {
  invariant(params.slug)

  return {
    product: await getProduct(params.slug),
  }
}

export default function Product() {
  const { product } = useLoaderData()
  return (
    <div>
      <div>{product.id}</div>
      <div>{product.slug}</div>
      <div>{product.name}</div>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  const slug = useParam('slug')

  if (caught.status === 404) {
    return <div>Product {slug} not found</div>
  }
  return <div>uh oh</div>
}
