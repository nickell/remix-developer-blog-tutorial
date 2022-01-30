import { Outlet, Link, useLoaderData, LoaderFunction, json } from 'remix'
import { getPosts } from '~/posts'
import adminStyles from '~/styles/admin.css'

export const links = () => {
  return [{ rel: 'stylesheet', href: adminStyles }]
}

type LoaderData = Awaited<ReturnType<typeof getPosts>>

export const loader: LoaderFunction = async () => {
  return json<LoaderData>(await getPosts())
}

export default function Admin() {
  const posts = useLoaderData<LoaderData>()
  return (
    <div className="admin">
      <nav>
        <Link to="/">Home</Link>
        <h1>Admin</h1>
        <ul>
          {posts.map(post => (
            <li key={post.slug}>
              <Link to={`/admin/edit/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
