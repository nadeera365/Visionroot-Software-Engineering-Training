# Daily Evidence Record: Day 01

Date: 2026-10-26
Day / topic: Day 01, Requirements and SDLC
Objective: Understand the problem and define what successful completion means.

## What I learned
- SDLC steps: requirements, design, build, test, release, maintenance.
- A user story says who wants what and why. Acceptance criteria say how to check it is done.
- Functional requirements say what the system does. Non-functional requirements say how well it does it.
- MVP is the smallest version that still works for the user. Other ideas go to the future backlog.
- Definition of Done means the exact checks a story must pass before it is finished.

## What I implemented
- Problem statement and user types (Requester, Support staff).
- 8 user stories with acceptance criteria.
- Backlog in Jira: 8 MVP stories in the MVP sprint, 5 future improvements left in the Backlog.
- Use case diagram showing what each user can do.

## Files / folders changed
- docs/requirements.md
- docs/use-case-diagram.png
- evidence/Day-01/daily-log.md
- evidence/Day-01/backlog-mvp-sprint.png
- evidence/Day-01/backlog-future.png

## How I tested it
- Read each user story and checked that every acceptance criteria can be tested with a clear yes or no.
- Checked that every functional requirement (FR-1 to FR-8) is covered by at least one user story.

## Evidence links (screenshots, tests, diagrams)
- docs/use-case-diagram.png
- evidence/Day-01/backlog-mvp-sprint.png (Jira, MVP in backlog)
- evidence/Day-01/backlog-future.png (Jira, future improvements in Backlog)

## Problem encountered
I faced three problems on Day 01.
1. I found it difficult to define good user stories with clear acceptance criteria.
2. I was not sure which tool to use to create a backlog and how to set it up.
3. I had difficulty committing my work to a branch and recording the commit details in the daily log.


## How I investigated it
1. I studied the user story format ("As a ..., I want ..., so that ...") and how acceptance criteria are written (Given, When, Then). Then I wrote the stories for the Service Request project.
2. I compared options for managing a backlog and chose Jira. I used YouTube tutorials to learn how to create a project, add issues and create a sprint.
3. I studied the feature branch workflow in Git (create a branch, add, commit, push, pull request) and how to get a commit hash.

## Root cause
These were new tasks for me in a real project. I had little practice with writing user stories, using Jira, and working with branches and pull requests, so I needed extra time to learn them.

## How I fixed it
1. I wrote 8 user stories, each with acceptance criteria that can be checked with a clear yes or no.
2. I created a Jira project, added the stories as issues, put the 8 MVP stories in an "MVP" sprint, and kept the 5 future improvements in the Backlog. I saved screenshots as evidence.
3. I created the branch docs/day-01-requirements, committed my files, pushed the branch and opened a pull request. I saved the commit hash using git log -1 --format=%H.


## What I would improve
Next time I will write the acceptance criteria while I write each story, and I will make small commits during the day instead of one big commit at the end.

## GitHub branch
docs/day-01-requirements

## Pull request
https://github.com/nadeera365/Visionroot-Software-Engineering-Training/pull/1

## Commit hash
eb467cdd9664e8be3812a1b440db26500508acfd

## Blockers / questions for supervisor
- Question for review: Is it okay to use Jira for the backlog?
