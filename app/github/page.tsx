"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Code2,
  ExternalLink,
  GitFork,
  Github,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Star,
  Users,
} from "lucide-react";

import GitHubContributionCalendar from "@/components/github/GitHubContributionCalendar";
import Navbar from "@/components/Navbar";
import Contact from "@/components/sections/Contact";

type GitHubUser = {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
};

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  fork: boolean;
  topics?: string[];
  updated_at: string;
};

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload?: {
    size?: number;
    action?: string;
    ref_type?: string;
  };
};

type GitHubApiData = {
  username: string;
  fetchedAt: string;
  user: GitHubUser;
  repos: GitHubRepo[];
  events: GitHubEvent[];
};

type RepoSort = "updated" | "stars" | "name";

function compactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function eventText(event: GitHubEvent) {
  const repo = event.repo.name.split("/")[1] || event.repo.name;

  switch (event.type) {
    case "PushEvent":
      return `Pushed ${event.payload?.size ?? ""} commit${
        event.payload?.size === 1 ? "" : "s"
      } to ${repo}`;
    case "CreateEvent":
      return `Created ${event.payload?.ref_type || "content"} in ${repo}`;
    case "PullRequestEvent":
      return `${event.payload?.action || "Updated"} a pull request in ${repo}`;
    case "IssuesEvent":
      return `${event.payload?.action || "Updated"} an issue in ${repo}`;
    case "WatchEvent":
      return `Starred ${repo}`;
    case "ForkEvent":
      return `Forked ${repo}`;
    case "ReleaseEvent":
      return `Published a release in ${repo}`;
    default:
      return `${event.type.replace("Event", "")} activity in ${repo}`;
  }
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_14px_rgba(45,212,191,0.8)]" />
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-teal">
        {children}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface/55 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal/35 hover:shadow-[0_18px_60px_rgba(0,0,0,0.20)]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-teal/[0.06] blur-2xl transition-colors group-hover:bg-teal/[0.12]" />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal/20 bg-teal/10 text-teal">
            {icon}
          </div>
          <ArrowUpRight
            size={15}
            className="text-muted/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal"
          />
        </div>

        <p className="font-display text-3xl font-semibold tracking-tight text-ink">
          {value}
        </p>
        <p className="mt-1 text-sm font-medium text-ink/80">{label}</p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
          {hint}
        </p>
      </div>
    </article>
  );
}

function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <article className="group relative flex min-h-[290px] flex-col overflow-hidden rounded-2xl border border-border bg-surface/45 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal/35 hover:bg-surface/65 hover:shadow-[0_22px_70px_rgba(0,0,0,0.22)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/0 to-transparent transition-all duration-500 group-hover:via-teal/55" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-base/70 text-teal">
          <Github size={19} />
        </div>

        <div className="flex items-center gap-2">
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${repo.name} live site`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-base/45 text-muted transition hover:border-teal/30 hover:text-teal"
            >
              <ExternalLink size={15} />
            </a>
          )}

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${repo.name} on GitHub`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-base/45 text-muted transition hover:border-teal/30 hover:text-teal"
          >
            <Github size={15} />
          </a>
        </div>
      </div>

      <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
        Repository
      </p>

      <h3 className="mt-2 break-words font-display text-xl font-semibold leading-tight text-ink transition-colors group-hover:text-teal">
        {repo.name}
      </h3>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
        {repo.description || "Public GitHub repository."}
      </p>

      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-border bg-base/55 px-2.5 py-1 font-mono text-[9px] text-muted"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto border-t border-border/70 pt-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] text-muted">
          {repo.language && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-teal" />
              {repo.language}
            </span>
          )}

          <span className="inline-flex items-center gap-1">
            <Star size={12} />
            {repo.stargazers_count}
          </span>

          <span className="inline-flex items-center gap-1">
            <GitFork size={12} />
            {repo.forks_count}
          </span>
        </div>

        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted/75">
          Updated {formatDate(repo.updated_at)}
        </p>
      </div>
    </article>
  );
}

export default function GitHubPage() {
  const [data, setData] = useState<GitHubApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [sortBy, setSortBy] = useState<RepoSort>("updated");

  async function loadGitHubData(manual = false) {
    try {
      manual ? setRefreshing(true) : setLoading(true);
      setError("");

      const response = await fetch("/api/github", {
        method: "GET",
        cache: "no-store",
      });

      const body = await response.json();

      console.log("GitHub /api/github response:", body);

      if (!response.ok) {
        throw new Error(body.error || "Unable to load GitHub data.");
      }

      setData(body);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load GitHub data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadGitHubData();
  }, []);

  const repos = useMemo(
    () => (data?.repos || []).filter((repo) => !repo.fork),
    [data]
  );

  const totalStars = useMemo(
    () => repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    [repos]
  );

  const totalForks = useMemo(
    () => repos.reduce((sum, repo) => sum + repo.forks_count, 0),
    [repos]
  );

  const languages = useMemo(() => {
    const map = new Map<string, number>();

    repos.forEach((repo) => {
      if (!repo.language) return;
      map.set(repo.language, (map.get(repo.language) || 0) + 1);
    });

    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [repos]);

  const availableLanguages = useMemo(
    () => ["All", ...languages.map(([language]) => language)],
    [languages]
  );

  const maxLanguageCount = Math.max(
    1,
    ...languages.map(([, count]) => count)
  );

  const filteredRepos = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = repos.filter((repo) => {
      const matchesSearch =
        !query ||
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.topics?.some((topic) => topic.toLowerCase().includes(query));

      const matchesLanguage =
        languageFilter === "All" || repo.language === languageFilter;

      return Boolean(matchesSearch && matchesLanguage);
    });

    return [...result].sort((a, b) => {
      if (sortBy === "stars") {
        return b.stargazers_count - a.stargazers_count;
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      return (
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
      );
    });
  }, [repos, search, languageFilter, sortBy]);

  const recentEvents = useMemo(
    () => (data?.events || []).slice(0, 4),
    [data]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-base text-ink">
        <Navbar />
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[length:44px_44px] opacity-25 [mask-image:radial-gradient(circle_at_center,black_5%,transparent_65%)]" />

          <div className="relative flex flex-col items-center text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-teal/20 bg-teal/10">
              <Loader2 size={27} className="animate-spin text-teal" />
            </div>
            <p className="mt-6 font-display text-xl font-semibold">
              Connecting to GitHub
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Loading live portfolio data
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data?.user) {
    return (
      <main className="min-h-screen bg-base text-ink">
        <Navbar />
        <div className="mx-auto flex min-h-screen w-[90%] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-red-400/20 bg-surface/70 p-8 backdrop-blur-xl md:p-10">
            <Github size={34} className="mb-6 text-red-400" />
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-red-400">
              Connection error
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold">
              GitHub data unavailable
            </h1>
            <p className="mt-4 text-muted">{error}</p>

            <button
              type="button"
              onClick={() => loadGitHubData(true)}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-base"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const user = data.user;

  return (
    <main className="relative min-h-screen overflow-hidden bg-base text-ink">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 bg-grid-pattern bg-[length:44px_44px] opacity-[0.18] [mask-image:radial-gradient(ellipse_at_top,black_8%,transparent_70%)]" />
      <div className="pointer-events-none fixed -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-teal/[0.08] blur-[140px]" />
      <div className="pointer-events-none fixed -left-56 top-[45%] h-[32rem] w-[32rem] rounded-full bg-teal/[0.04] blur-[150px]" />

      <div className="relative z-10 mx-auto  max-w-[90%] xl:w-[98%] pb-24 pt-28 md:pt-36">
        {/* PROFILE HERO */}
        <section className="relative overflow-hidden rounded-[28px] 
        border border-border bg-surface/45 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/60 to-transparent" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal/[0.08] blur-[90px]" />

          <div className="relative grid gap-10 p-4  lg:grid-cols-[1fr_auto] lg:items-end lg:p-8">
            <div>
              <div className="mb-7 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-teal">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />
                  Live GitHub
                </span>

                <span className="rounded-full border border-border bg-base/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                  @{user.login}
                </span>
              </div>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative w-fit shrink-0">
                  <div className="absolute -inset-2 rounded-[24px] bg-teal/10 blur-xl" />
                  <img
                    src={user.avatar_url}
                    alt={user.name || user.login}
                    className="relative h-20 w-20 rounded-[22px] 
                    border border-border object-cover shadow-2xl md:h-28 md:w-28"
                  />
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    Developer profile
                  </p>
                  <h1 className="mt-2 font-display text-2xl 
                  font-semibold leading-[0.95] tracking-[-0.04em] text-ink sm:text-3xl md:text-4xl">
                    {user.name || user.login}
                  </h1>
                </div>
              </div>

              {user.bio && (
                <p className="mt-7 max-w-2xl text-base leading-7 text-muted md:text-lg">
                  {user.bio}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted">
                {user.location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={15} className="text-teal" />
                    {user.location}
                  </span>
                )}

                <span className="inline-flex items-center gap-2">
                  <Users size={15} className="text-teal" />
                  {compactNumber(user.followers)} followers
                </span>

                <span className="inline-flex items-center gap-2">
                  <Code2 size={15} className="text-teal" />
                  {user.public_repos} public repos
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button
                type="button"
                disabled={refreshing}
                onClick={() => loadGitHubData(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-base/45 px-4 py-3 text-sm text-ink transition hover:border-teal/30 hover:text-teal disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-base transition hover:-translate-y-0.5 hover:bg-teal/90"
              >
                <Github size={17} />
                Open GitHub
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* STATS */}
        {/* <section className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Repositories"
            value={user.public_repos}
            hint="Public codebase"
            icon={<BookOpen size={18} />}
          />
          <StatCard
            label="Total Stars"
            value={compactNumber(totalStars)}
            hint="Across repositories"
            icon={<Star size={18} />}
          />
          <StatCard
            label="Total Forks"
            value={compactNumber(totalForks)}
            hint="Community reuse"
            icon={<GitFork size={18} />}
          />
          <StatCard
            label="Followers"
            value={compactNumber(user.followers)}
            hint="GitHub network"
            icon={<Users size={18} />}
          />
        </section> */}

        {/* CONTRIBUTIONS */}
        <section className="mt-12">
          <Eyebrow>Consistency / Contributions</Eyebrow>
          <h2 className="font-display mb-6 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
            Contribution history
          </h2>
          {/* <p className=" max-w-2xl text-sm leading-6 text-muted md:text-base">
            Real year-by-year GitHub contribution activity with the same
            contribution calendar experience.
          </p> */}

          <div className="relative  overflow-hidden rounded-[26px] 
          border border-border bg-surface/45 px-4 backdrop-blur-xl sm:p-6 md:p-4">
            {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/45 to-transparent" /> */}
            <GitHubContributionCalendar/>
          </div>
        </section>

        {/* INSIGHTS */}
        <section className="mt-20 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-[26px] border border-border bg-surface/45 p-6 backdrop-blur-xl md:p-8">
            <Eyebrow>Stack / Languages</Eyebrow>
            <h2 className="font-display text-2xl font-semibold">
              Technology footprint
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Primary languages across your public repositories.
            </p>

            <div className="mt-8 space-y-6">
              {languages.slice(0, 8).map(([language, count]) => (
                <div key={language}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-teal" />
                      <span className="text-sm font-medium">{language}</span>
                    </div>
                    <span className="font-mono text-[10px] text-muted">
                      {count} repo{count === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-base/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal/55 to-teal"
                      style={{
                        width: `${Math.max(
                          8,
                          (count / maxLanguageCount) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[26px] border border-border bg-surface/45 p-6 backdrop-blur-xl md:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <Eyebrow>Timeline / Activity</Eyebrow>
                <h2 className="font-display text-2xl font-semibold">
                  Recent public activity
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Latest public events returned by GitHub.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal/20 bg-teal/10 text-teal">
                <Activity size={18} />
              </div>
            </div>

            <div className="mt-7 divide-y divide-border/70">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="group flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-base/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6 text-ink/85">
                      {eventText(event)}
                    </p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-muted">
                      {formatDate(event.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* REPOSITORY EXPLORER */}
        <section className="mt-24">
          <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <Eyebrow>Code / Repositories</Eyebrow>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                Repository explorer
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted md:text-base">
                Search every public repository and filter it by language.
              </p>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {filteredRepos.length} of {repos.length} repositories
            </p>
          </div>

          <div className="mb-6 grid gap-3 rounded-2xl border border-border bg-surface/45 p-3 backdrop-blur-xl lg:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search repositories, topics or descriptions..."
                className="h-11 w-full rounded-xl border border-border bg-base/55 pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-muted/65 focus:border-teal/40"
              />
            </label>

            <select
              value={languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value)}
              className="h-11 min-w-[170px] rounded-xl border border-border bg-base/55 px-4 text-sm text-ink outline-none focus:border-teal/40"
            >
              {availableLanguages.map((language) => (
                <option key={language} value={language}>
                  {language === "All" ? "All languages" : language}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as RepoSort)}
              className="h-11 min-w-[160px] rounded-xl border border-border bg-base/55 px-4 text-sm text-ink outline-none focus:border-teal/40"
            >
              <option value="updated">Recently updated</option>
              <option value="stars">Most starred</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {filteredRepos.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-border bg-surface/30 px-6 py-16 text-center">
              <Search size={20} className="mx-auto text-muted" />
              <h3 className="mt-4 font-display text-xl font-semibold">
                No repositories found
              </h3>
              <p className="mt-2 text-sm text-muted">
                Try changing the search or language filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setLanguageFilter("All");
                }}
                className="mt-5 text-sm font-medium text-teal hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <div className="mt-14 flex flex-col gap-2 border-t border-border/70 pt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Data source · GitHub API</span>
          <span>
            Last synced · {data.fetchedAt ? formatDate(data.fetchedAt) : "Live"}
          </span>
        </div>
      </div>

      <Contact />
    </main>
  );
}
