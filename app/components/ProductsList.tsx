import { Link } from 'remix'
import { Product } from '~/products'

export default function ProductsList({ products }: { products: Product[] }) {
  return (
    <div className="flex flex-row flex-wrap">
      {products.map(({ id, name, slug }) => (
        <Link
          key={id}
          className="text-center p-10 bg-slate-100 mx-10"
          to={`products/${slug}`}
        >
          {name}
        </Link>
      ))}
    </div>
  )
}
