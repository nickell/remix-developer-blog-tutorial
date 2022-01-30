import { Outlet, Link, useLoaderData, LoaderFunction } from 'remix'
import { getPosts, Post } from '~/posts'
import adminStyles from '~/styles/admin.css'

export const links = () => {
  return [{ rel: 'stylesheet', href: adminStyles }]
}

export const loader: LoaderFunction = () => {
  return getPosts()
}

export default function Admin() {
  const posts = useLoaderData<Post[]>()
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
