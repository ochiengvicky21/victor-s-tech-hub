// Static CMS config. The public site reads markdown and portfolio JSON from this repository.
// The admin panel commits content through the GitHub Contents API.
// Commits trigger your Netlify/host deploy → posts appear live within ~1 minute.
export const CMS = {
  owner: "ochiengvicky21",
  repo: "portfolio-content",
  branch: "main",
  postsPath: "content/posts", // .md files live here, one per post
} as const;

export const RAW_BASE = `https://raw.githubusercontent.com/${CMS.owner}/${CMS.repo}/${CMS.branch}`;
export const API_BASE = `https://api.github.com/repos/${CMS.owner}/${CMS.repo}/contents`;
