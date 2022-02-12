import { useLoaderData } from 'remix'
import { getProducts } from '~/products'
import ProductsList from '~/components/ProductsList'

export const loader = async () => {
  return {
    products: await getProducts(),
  }
}

export default function Index() {
  const { products } = useLoaderData()
  return (
    <>
      <h1>Ecomm Site Name</h1>
      <div>
        <h2>Products List</h2>
        <ProductsList products={products} />
      </div>
    </>
  )
}
