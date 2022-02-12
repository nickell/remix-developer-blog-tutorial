import { json } from 'remix'

export type Product = {
  id: number
  name: string
  slug: string
}

export async function getProducts(): Promise<Product[]> {
  return [
    {
      id: 1,
      name: 'Shirt',
      slug: 'shirt',
    },
    {
      id: 2,
      name: 'Shorts',
      slug: 'shorts',
    },
    {
      id: 3,
      name: 'Shoes',
      slug: 'shoes',
    },
    {
      id: 4,
      name: 'Jacket',
      slug: 'jacket',
    },
    {
      id: 5,
      name: 'Hoodie',
      slug: 'hoodie',
    },
    {
      id: 6,
      name: 'Beanie',
      slug: 'beanie',
    },
    {
      id: 7,
      name: 'Slacks',
      slug: 'slacks',
    },
    {
      id: 8,
      name: 'Socks',
      slug: 'socks',
    },
    {
      id: 9,
      name: 'Wallet',
      slug: 'wallet',
    },
    {
      id: 10,
      name: 'Backpack',
      slug: 'backpack',
    },
    {
      id: 11,
      name: 'Bag',
      slug: 'bag',
    },
  ]
}

export async function getProduct(slug: string): Promise<Product> {
  const products = await getProducts()
  const product = products.find(p => p.slug === slug)

  if (!product) {
    throw json('Product not found', { status: 404 })
  }

  return product
}
