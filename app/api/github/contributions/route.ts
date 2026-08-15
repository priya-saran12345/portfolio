import { NextRequest, NextResponse } from "next/server";

const GITHUB_USERNAME =
  process.env.GITHUB_USERNAME;

const GITHUB_TOKEN =
  process.env.GITHUB_TOKEN;

export async function GET(
  request: NextRequest
) {
  if (!GITHUB_USERNAME) {
    return NextResponse.json(
      {
        error: "GITHUB_USERNAME is missing",
      },
      {
        status: 500,
      }
    );
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      {
        error: "GITHUB_TOKEN is missing",
      },
      {
        status: 500,
      }
    );
  }

  const searchParams =
    request.nextUrl.searchParams;

  const requestedYear =
    Number(
      searchParams.get("year")
    ) ||
    new Date().getFullYear();

  const from =
    `${requestedYear}-01-01T00:00:00Z`;

  const to =
    requestedYear ===
    new Date().getFullYear()
      ? new Date().toISOString()
      : `${requestedYear}-12-31T23:59:59Z`;

  const query = `
    query Contributions(
      $login: String!
      $from: DateTime!
      $to: DateTime!
    ) {
      user(login: $login) {
        login

        contributionsCollection(
          from: $from
          to: $to
        ) {
          contributionYears

          contributionCalendar {
            totalContributions

            colors

            months {
              name
              firstDay
              totalWeeks
              year
            }

            weeks {
              firstDay

              contributionDays {
                date
                contributionCount
                contributionLevel
                color
                weekday
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response =
      await fetch(
        "https://api.github.com/graphql",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${GITHUB_TOKEN}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            query,

            variables: {
              login:
                GITHUB_USERNAME,

              from,

              to,
            },
          }),

          cache: "no-store",
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      return NextResponse.json(
        result,
        {
          status:
            response.status,
        }
      );
    }

    if (result.errors) {
      return NextResponse.json(
        {
          error:
            "GitHub GraphQL returned errors",

          errors:
            result.errors,
        },
        {
          status: 500,
        }
      );
    }

    const collection =
      result.data?.user
        ?.contributionsCollection;

    return NextResponse.json({
      year:
        requestedYear,

      contributionYears:
        collection
          ?.contributionYears ||
        [],

      calendar:
        collection
          ?.contributionCalendar ||
        null,
    });
  } catch (error) {
    console.error(
      "Contribution API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to fetch GitHub contributions",
      },
      {
        status: 500,
      }
    );
  }
}