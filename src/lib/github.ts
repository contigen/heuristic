import { Octokit } from '@octokit/rest'
import { shouldProcessFile } from './utils'
import { unstable_cache } from 'next/cache'

type RepoContent = {
  path: string
  content: string
  type: 'file' | 'directory'
  sha: string
}

export function createGitHubClient(token: string) {
  const octokit = new Octokit({ auth: token })

  return {
    async getUserRepos() {
      const { data: repos } = await unstable_cache(
        async () => await octokit.repos.listForAuthenticatedUser()
      )()
      return repos
    },

    async getRepoContents(
      owner: string,
      repo: string,
      path: string = ''
    ): Promise<RepoContent[]> {
      const results: RepoContent[] = []

      const fetchContents = async (currentPath: string) => {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: currentPath,
          mediaType: { format: 'raw' },
        })
        if (Array.isArray(data)) {
          for (const item of data) {
            if (item.type === 'file') {
              if (shouldProcessFile(item.name)) {
                const fileData = await octokit.repos.getContent({
                  owner,
                  repo,
                  path: item.path,
                  mediaType: { format: 'raw' },
                })

                results.push({
                  path: item.path,
                  content: fileData.data.toString(),
                  type: 'file',
                  sha: item.sha,
                })
              }
            } else if (item.type === 'dir') {
              await fetchContents(item.path)
            }
          }
        }
      }

      await fetchContents(path)
      return results
    },

    async getRepoLanguages(owner: string, repo: string) {
      const { data } = await octokit.repos.listLanguages({
        owner,
        repo,
      })
      return data
    },

    async getRepoBranches(owner: string, repo: string) {
      const { data } = await octokit.repos.listBranches({
        owner,
        repo,
      })
      return data
    },

    async getRepoCommits(owner: string, repo: string, branch: string = '') {
      const params = { owner, repo, per_page: 10 }
      if (branch) params.branch = branch

      const { data } = await octokit.repos.listCommits(params)
      return data
    },
  }
}
