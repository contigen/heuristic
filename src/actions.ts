'use server'

import { redirect } from 'next/navigation'
import { auth } from './auth'
import { createGitHubClient } from './lib/github'

async function authenticatedGitHubClient() {
  const session = await auth()
  const token = session?.githubToken
  if (!token) redirect('/login')
  return createGitHubClient(token)
}

export async function getUserReposAction() {
  const { getUserRepos } = await authenticatedGitHubClient()
  const repos = await getUserRepos()
  return repos.map(repo => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    updatedAt: repo.updated_at,
    stars: repo.stargazers_count,
    language: repo.language,
    isPrivate: repo.private,
  }))
}

export async function getRepoContentsAction(
  owner: string,
  repo: string,
  path: string = ''
) {
  const { getRepoContents } = await authenticatedGitHubClient()
  const session = await auth()
  if (!session?.githubUserName) redirect('/login')
  return await getRepoContents(session.githubUserName, repo, path)
}

export async function getRepoLanguagesAction(owner: string, repo: string) {
  const { getRepoLanguages } = await authenticatedGitHubClient()
  return await getRepoLanguages(owner, repo)
}

export async function getRepoDetailsAction(owner: string, repo: string) {
  const { getRepoContents, getRepoLanguages, getRepoBranches, getRepoCommits } =
    await authenticatedGitHubClient()

  const [contents, languages, branches, commits] = await Promise.all([
    getRepoContents(owner, repo),
    getRepoLanguages(owner, repo),
    getRepoBranches(owner, repo),
    getRepoCommits(owner, repo),
  ])

  return {
    contents,
    languages,
    branches,
    commits,
  }
}

export async function compareReposAction(
  repos: Array<{ owner: string; repo: string }>
) {
  const github = await authenticatedGitHubClient()

  const repoDetails = await Promise.all(
    repos.map(async ({ owner, repo }) => {
      const [languages, branches] = await Promise.all([
        github.getRepoLanguages(owner, repo),
        github.getRepoBranches(owner, repo),
      ])

      return {
        owner,
        repo,
        languages,
        branches,
      }
    })
  )

  return repoDetails
}
