import { Outlet, Link, NavLink, useLoaderData, LoaderFunction } from 'remix'
import { getPosts } from '~/posts'

type LoaderData = Awaited<ReturnType<typeof getPosts>>

export const loader: LoaderFunction = () => {
  return getPosts()
}

export default function Posts() {
  const posts = useLoaderData<LoaderData>()
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <ul>
          {posts.map(post => (
            <li key={post.slug}>
              <NavLink
                to={post.slug}
                style={({ isActive }) => ({
                  color: isActive ? 'red' : 'black',
                })}
              >
                {post.title}
              </NavLink>
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
