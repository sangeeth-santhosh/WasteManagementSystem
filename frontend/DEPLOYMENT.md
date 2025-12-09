# Frontend Deployment Notes

SPA routing (React Router):

- Vercel: keep `vercel.json` rewrite `{ "source": "/(.*)", "destination": "/" }` so all routes serve index.html.
- Render (static): add redirect rule `/*` -> `/` with status 200 in the dashboard.

API base URL:

- Set `VITE_API_BASE_URL` (or `REACT_APP_API_URL`) to your HTTPS API endpoint in production.
- Avoid hardcoding localhost in production; the frontend defaults to same-origin if env is unset.

CORS reminder:

- Backend must allow CORS from dev origin (e.g., http://localhost:5173 or your chosen dev port) and your deployed frontend domains (Vercel/Render URLs).
- Serving frontend over HTTPS with an HTTP API will cause mixed-content errors; use HTTPS for the API in production.
