import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_USERNAME =
  process.env.GITHUB_USERNAME || "YOUR_GITHUB_USERNAME";

const GITHUB_TOKEN =
  process.env.GITHUB_TOKEN;

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

async function githubFetch(endpoint: string) {
  const response = await fetch(
    `https://api.github.com${endpoint}`,
    {
      headers: githubHeaders(),

      // Cache the upstream GitHub request for 30 minutes.
      // The browser will still call /api/github, so you can
      // inspect the JSON in DevTools Network.
      next: {
        revalidate: 1800,
      },
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
    rateLimit: {
      limit:
        response.headers.get(
          "x-ratelimit-limit"
        ),
      remaining:
        response.headers.get(
          "x-ratelimit-remaining"
        ),
      reset:
        response.headers.get(
          "x-ratelimit-reset"
        ),
    },
  };
}

export async function GET() {
  if (
    !GITHUB_USERNAME ||
    GITHUB_USERNAME ===
      "YOUR_GITHUB_USERNAME"
  ) {
    return NextResponse.json(
      {
        error:
          "GITHUB_USERNAME is not configured.",
        setup:
          "Add GITHUB_USERNAME=your_username to .env.local and restart Next.js.",
      },
      {
        status: 500,
      }
    );
  }

  try {
    const [
      userResponse,
      reposResponse,
      eventsResponse,
    ] = await Promise.all([
      githubFetch(
        `/users/${GITHUB_USERNAME}`
      ),

      githubFetch(
        `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`
      ),

      githubFetch(
        `/users/${GITHUB_USERNAME}/events/public?per_page=100`
      ),
    ]);

    if (!userResponse.ok) {
      return NextResponse.json(
        {
          error:
            "GitHub profile request failed.",
          status:
            userResponse.status,
          githubResponse:
            userResponse.data,
          rateLimit:
            userResponse.rateLimit,
        },
        {
          status:
            userResponse.status,
        }
      );
    }

    return NextResponse.json(
      {
        username:
          GITHUB_USERNAME,

        fetchedAt:
          new Date().toISOString(),

        user:
          userResponse.data,

        repos:
          reposResponse.ok
            ? reposResponse.data
            : [],

        events:
          eventsResponse.ok
            ? eventsResponse.data
            : [],

        apiStatus: {
          user:
            userResponse.status,
          repos:
            reposResponse.status,
          events:
            eventsResponse.status,
        },

        rateLimit:
          userResponse.rateLimit,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "GitHub API route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load GitHub data.",
      },
      {
        status: 500,
      }
    );
  }
}
