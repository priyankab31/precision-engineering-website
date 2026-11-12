# Precision Engineering Website

Multi-page starter website for a CNC machining and precision engineering business in Kurnool, Andhra Pradesh, India.

## Included pages
Home, About, Services, CNC Turning, CNC Milling, Components, Industries, Materials, Quality, Machinery, Gallery, Contact, Login, Register and Customer Dashboard.

## Run locally
For basic static pages, open `index.html` in a browser. For Supabase authentication and module scripts, run a local static server (for example VS Code Live Server) or deploy to a static host.

## Configure Supabase
1. Create a project at https://supabase.com.
2. Open Project Settings / API and copy the Project URL and publishable (or anon) key.
3. Put those values in `assets/js/supabase.js`.
4. Open SQL Editor and run `supabase/schema.sql`.
5. In Authentication settings, configure your allowed site URL and redirect URLs for your deployed domain.
6. Create a **private** Storage bucket named `customer-drawings` only after configuring secure storage policies.

## Important production notes
- GitHub Pages is not recommended for hosting a commercial business website under its published terms. Use GitHub to store code and a commercial-friendly static host such as Cloudflare Pages for deployment.
- The quote form can submit text enquiries after Supabase is configured. Anonymous drawing uploads are not enabled in this starter.
- The customer dashboard shows only enquiries belonging to the signed-in customer under the supplied RLS policy.
- No admin dashboard is included. Add admin functionality using a secure server-side implementation; never expose a Supabase service-role key in frontend code.
- Replace all sample business details, machine specifications, photos, email and phone information with verified company information.
- Do not claim certifications, customer relationships, machine capacities or quality systems unless they are true.
- Add a privacy policy, terms, cookie/privacy notices as appropriate, and have the collection of personal data reviewed for applicable Indian and international privacy requirements before launch.
# precision-engineering-website
