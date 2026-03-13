import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import type { Request, Response } from 'express';

const PROJECTS_DIR = path.resolve(__dirname, '..', '..');
const SELF_NAME = 'project-command-center';
const GH_OWNER = 'openclawsean024-create';
const GH_BIN = 'C:/Program Files/GitHub CLI/gh.exe';

type RepoInfo = {
  name: string;
  nameWithOwner: string;
  stargazerCount: number;
  url: string;
  visibility: string;
  updatedAt: string;
};

type PagesInfo = {
  name: string;
  pages: string | null;
};

type VercelInfo = {
  linked: boolean;
  projectId: string | null;
  orgId: string | null;
};

function inferCategory(name: string) {
  const n = name.toLowerCase();
  if (n.includes('dashboard')) return 'Dashboard';
  if (n.includes('collector')) return 'Collector';
  if (n.includes('tracker')) return 'Tracker';
  if (n.includes('research')) return 'Research';
  if (n.includes('blog')) return 'Content';
  if (n.includes('automation')) return 'Automation';
  if (n.includes('speech') || n.includes('audio') || n.includes('voice')) return 'Media Tool';
  if (n.includes('report') || n.includes('manager')) return 'Business Tool';
  if (n.includes('ai') || n.includes('analyzer')) return 'AI Tool';
  return 'Project';
}

function inferStatus(name: string) {
  const live = new Set(['ebook-to-audiobook', 'project-token-monitor', 'staff-reporting-system']);
  return live.has(name) ? 'live' : 'active';
}

function loadRepos(): RepoInfo[] {
  try {
    const raw = execSync(`& "${GH_BIN}" repo list ${GH_OWNER} --limit 100 --json name,nameWithOwner,stargazerCount,url,visibility,updatedAt`, {
      shell: 'powershell.exe',
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function loadPages(): PagesInfo[] {
  const repoNames = [
    'ai-interview-assistant','automation','business-card-manager','ebook-to-audiobook','ergonomic-presentation','marathon-pace-bracelet','market-research-tool','meeting-recorder','openclaw-news-collector','presentation-generator','project-dashboard','project-token-monitor','ptt-tracker','report-form','staff-reporting-system','sui-blog','text-to-speech-mvp','trade-backtest','youtube-trending-collector'
  ];

  return repoNames.map((name) => {
    try {
      const raw = execSync(`& "${GH_BIN}" api repos/${GH_OWNER}/${name}/pages`, {
        shell: 'powershell.exe',
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      const parsed = JSON.parse(raw);
      return { name, pages: parsed.html_url ?? null };
    } catch {
      return { name, pages: null };
    }
  });
}

function loadVercelInfo(projectName: string): VercelInfo {
  try {
    const projectJson = path.join(PROJECTS_DIR, projectName, '.vercel', 'project.json');
    if (!fs.existsSync(projectJson)) {
      return { linked: false, projectId: null, orgId: null };
    }
    const parsed = JSON.parse(fs.readFileSync(projectJson, 'utf8'));
    return {
      linked: true,
      projectId: parsed.projectId ?? null,
      orgId: parsed.orgId ?? null,
    };
  } catch {
    return { linked: false, projectId: null, orgId: null };
  }
}

function getProjects() {
  const repos = loadRepos();
  const pages = loadPages();
  const repoMap = new Map(repos.map((repo) => [repo.name, repo]));
  const pagesMap = new Map(pages.map((item) => [item.name, item.pages]));

  return fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== SELF_NAME)
    .filter((name) => !name.startsWith('.'))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const repo = repoMap.get(name);
      const pageUrl = pagesMap.get(name) ?? null;
      const vercel = loadVercelInfo(name);
      return {
        name,
        status: inferStatus(name),
        category: inferCategory(name),
        github: !!repo,
        deploy: !!pageUrl || vercel.linked,
        note: repo ? '本地專案 + GitHub 已比對' : '從本地 projects 目錄即時讀取',
        githubUrl: repo?.url ?? null,
        stars: repo?.stargazerCount ?? 0,
        visibility: repo?.visibility?.toLowerCase() ?? null,
        githubUpdatedAt: repo?.updatedAt ?? null,
        pagesUrl: pageUrl,
        vercelLinked: vercel.linked,
        vercelProjectId: vercel.projectId,
      };
    });
}

export default {
  'GET /api/projects': (_req: Request, res: Response) => {
    const data = getProjects();
    const summary = {
      total: data.length,
      active: data.filter((item) => item.status === 'active').length,
      live: data.filter((item) => item.status === 'live').length,
      github: data.filter((item) => item.github).length,
      deploy: data.filter((item) => item.deploy).length,
    };

    res.json({ success: true, data, summary });
  },
};
