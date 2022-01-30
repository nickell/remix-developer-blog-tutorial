import path from 'path'
import fs from 'fs/promises'
import parseFrontMatter from 'front-matter'
import invariant from 'tiny-invariant'
import { marked } from 'marked'
import { instanceOfNodeError } from '~/utils'

export interface JsonPost extends Omit<Post, 'date'> {
  date: string
}

export interface Post {
  slug: string
  title: string
  date: Date
  html: string
  markdown: string
}

export interface PostMarkdownAttributes {
  title: string
  date: string
}

interface NewPost {
  title: string
  slug: string
  date: string
  markdown: string
}

// relative to the server output not the source!
const postsPath = path.join(__dirname, '..', 'posts')

function pathFromSlug(slug: string) {
  return path.join(postsPath, slug + '.md')
}

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

export async function maybeGetPost(slug: string) {
  try {
    return await getPost(slug)
  } catch (e) {
    if (instanceOfNodeError(e, Error) && e.code === 'ENOENT') {
      return null
    }

    throw e
  }
}

export async function getPost(slug: string): Promise<JsonPost> {
  const filepath = pathFromSlug(slug)
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
    markdown: body,
  }
}

function createFileContents(post: NewPost) {
  let md = `---\n`
  md += `title: ${post.title}\n`
  md += `date: ${post.date}\n`
  md += `---\n`
  md += `\n${post.markdown}`

  return md
}

export async function createPost(post: NewPost) {
  await fs.writeFile(pathFromSlug(post.slug), createFileContents(post))

  return getPost(post.slug)
}

export async function removePost(slug: string) {
  await fs.unlink(pathFromSlug(slug))
}
