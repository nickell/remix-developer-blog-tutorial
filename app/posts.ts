import path from 'path'
import fs from 'fs/promises'
import parseFrontMatter from 'front-matter'
import invariant from 'tiny-invariant'
import { marked } from 'marked'

export type Post = {
  slug: string
  title: string
  date: Date
}

export type PostMarkdownAttributes = {
  title: string
  date: string
}

// relative to the server output not the source!
const postsPath = path.join(__dirname, '..', 'posts')

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title && attributes?.date
}

export async function getPosts() {
  const dir = await fs.readdir(postsPath)
  const posts = await Promise.all(
    dir.map(async filename => {
      const file = await fs.readFile(path.join(postsPath, filename))
      const { attributes } = parseFrontMatter(file.toString())
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      )
      return {
        slug: filename.replace(/\.md$/, ''),
        title: attributes.title,
        date: attributes.date,
      }
    })
  )

  return posts.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

export async function getPost(slug: string) {
  const filepath = path.join(postsPath, slug + '.md')
  const file = await fs.readFile(filepath)
  const { attributes, body } = parseFrontMatter(file.toString())
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  )
  const html = marked(body)
  return {
    slug,
    html,
    title: attributes.title,
    date: attributes.date,
  }
}

type NewPost = {
  title: string
  slug: string
  date: string
  markdown: string
}

export async function createPost(post: NewPost) {
  let md = `---\ntitle: ${post.title}\n---\n`
  md += `---\ndate: ${post.date}\n---\n`
  md += `\n${post.markdown}`
  await fs.writeFile(path.join(postsPath, post.slug + '.md'), md)
  return getPost(post.slug)
}
