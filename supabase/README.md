# Admin setup

The admin area uses Supabase email/password authentication. It does not provide
public registration: create the admin account from the Supabase dashboard.

## Configure Supabase

1. Create a Supabase project and an Auth user with the admin email and password.
2. Set that user's `app_metadata` role to `admin`. In the Supabase SQL editor,
   replace the email below and run:

   ```sql
   update auth.users
   set raw_app_meta_data =
     coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where lower(email) = lower('your-admin-email@example.com');
   ```

   The role must be in `app_metadata`, not user-editable `user_metadata`.
   Sign in again after changing the role so Supabase issues a refreshed token.

3. Run [`migrations/202610280001_job_applications.sql`](./migrations/202610280001_job_applications.sql)
   in the SQL editor. Row-level security restricts tracked applications to the
   signed-in admin user.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project's API
   settings in local development and the production host.

## Keep CMS publishing credentials on the server

Create a GitHub fine-grained personal access token limited to the
`ochiengvicky21/portfolio-content` repository with Contents read/write
permission. Configure it as the server-only `GITHUB_CMS_TOKEN` environment
variable in local development and production. Do not expose it as a `VITE_`
variable or commit it to source control.

The admin **Site sections** tab manages homepage copy, additional homepage
sections, selected client projects, and curated public code sources. The
published portfolio data is stored in
`content/site-content.json` in that repository. Project details are shared by
the homepage and the ATS resume.

For code excerpts, add a public GitHub or GitLab file URL and its applicable
open-source license and license URL. The site displays a short excerpt with
links back to the source and license; it does not search or scrape repositories
automatically. Only public `github.com` and `gitlab.com` file URLs are accepted.

The email/password session is checked server-side before the CMS or job-search
server functions run. Job applications are stored in Supabase behind RLS. Job
search uses the public Jobicy and Arbeitnow APIs, filters listings for the
portfolio's engineering specialties and East African or broadly eligible
remote locations, and links to the original listing. LinkedIn is provided as
an outbound search link; its protected pages are not scraped.
