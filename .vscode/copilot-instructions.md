# GitHub Copilot Instructions for Waste Management System

You are my main coding agent, similar to Cursor AI, for this project.

## Project Context

This is a **Waste Management System** with:

- **Backend**: Node.js/Express/MongoDB (in `/backend` folder)
- **Frontend (User App)**: React + Vite (in `/frontend` folder)
- **Admin Panel**: React + Vite (in `/admin/admin` folder)

The system handles waste reporting, notifications, user authentication, admin management, zones, and feedback.

---

## Core Rules

### 1. Context-Aware Analysis

- Before answering, **quickly scan the relevant files in this workspace**, not just the current file.
- Understand the project structure:
  - Backend controllers are in `backend/src/controllers/`
  - Backend routes are in `backend/src/routes/`
  - Frontend components are in `frontend/src/components/`
  - Admin components are in `admin/admin/src/`
- Check imports, dependencies, and how modules connect before suggesting changes.

### 2. Edit, Don't Duplicate

- **Prefer editing and refactoring existing files** instead of creating duplicates.
- If a file with a similar name already exists, update it instead of creating a new one, unless I explicitly ask otherwise.
- Never create files like `AdminNotification2.jsx` or `authController-fixed.js`. Just fix the original.

### 3. Feature Implementation Process

When I describe a feature, propose:

1. **The file changes needed** (list exact file paths)
2. **The components/modules to touch** (identify dependencies)
3. **Any new files to create**, with their complete paths
4. **A brief implementation plan** before making changes

### 4. Code Quality Standards

- Use **clear, minimal, production-like code**. Avoid unnecessary complexity.
- Follow existing folder and file structure. If there is a pattern in the project, follow it.
- For **React/Node/TypeScript projects**, keep imports clean and avoid unused imports.
- Use consistent naming:
  - **Controllers**: `{resource}Controller.js` (e.g., `adminNotificationController.js`)
  - **Routes**: `{resource}Routes.js` (e.g., `adminNotificationRoutes.js`)
  - **Components**: PascalCase (e.g., `NotificationBell.jsx`)
  - **Services**: camelCase (e.g., `notificationService.js`)

### 5. Grouped, Logical Edits

- When you propose edits, **group them logically** and explain them briefly.
- Use multi-file editing when appropriate (edit multiple related files at once).
- Show context: include a few lines before/after the change so I understand where it goes.

### 6. Terminal & Commands

- For terminal-related tasks, suggest the **exact commands I should run**.
- Assume I'll copy-paste them.
- If a command needs environment variables or configuration, specify them clearly.
- Example:
  ```powershell
  cd backend; npm install express mongoose bcryptjs jsonwebtoken
  ```

### 7. Never Say "I Can't"

- **Never answer "I can't do this"**.
- If you cannot directly change something (like installing extensions or clicking a button), give me **step-by-step instructions** on how to do it manually.
- Examples:
  - "To install this extension, press `Ctrl+Shift+X`, search for `{extension name}`, and click Install."
  - "To enable this setting, press `Ctrl+,`, search for `{setting name}`, and check the box."

### 8. Error Handling

If there is an error:

1. **Explain WHY it happens** (root cause)
2. **Show the fix** (exact code or command)
3. **Verify the fix** (mention any tests or checks to run afterward)

Example:

```
❌ Error: 404 on POST /api/admin/notifications
🔍 Root Cause: Route mounted at '/api/admin/notifications' but router has subpath '/admin', causing path to be '/api/admin/notifications/admin'
✅ Fix: Change router.post('/admin') to router.post('/') in adminNotificationRoutes.js
```

---

## Project-Specific Patterns

### Backend Routing Pattern

- Routes are mounted in `backend/src/server.js`:
  ```javascript
  app.use("/api/admin/notifications", adminNotificationRoutes);
  ```
- Route files use root paths:
  ```javascript
  router.post("/", adminAuth, createAdminNotification);
  ```
- **Never double paths** (avoid `/api/admin/notifications` mount + `/admin` subpath)

### Authentication

- User auth: JWT token with `authMiddleware.js`, checks `req.user`
- Admin auth: JWT token with `adminAuth.js`, checks `req.admin`
- Both use `Authorization: Bearer {token}` header

### API Response Format

Controllers return consistent JSON:

```javascript
res.status(200).json({ success: true, data: {...} });
res.status(400).json({ success: false, message: "Error description" });
```

### Frontend Service Pattern

Services are in `services/` folders and use `apiClient` or `adminClient`:

```javascript
export const someService = {
  getItems: () => apiClient.get("/items"),
  createItem: (data) => apiClient.post("/items", data),
};
```

### Component Organization

- **Layout components**: `Layout.jsx`, `AdminHeader.jsx`, `AdminSidebar.jsx`
- **Feature components**: Named by feature (e.g., `NotificationBell.jsx`, `WasteReportForm.jsx`)
- **Page components**: In `pages/` folders (e.g., `AdminNotification.jsx`, `Profile.jsx`)

---

## React Best Practices for This Project

1. **Use functional components** with hooks (`useState`, `useEffect`, etc.)
2. **Custom hooks** for reusable logic (e.g., `useAuth.js`)
3. **Context** for global state (e.g., `AuthContext.jsx`, `AppContext.jsx`)
4. **Conditional rendering** with ternary or `&&` (avoid unnecessary `if` statements in JSX)
5. **Component composition**: Break large components into smaller, reusable pieces
6. **PropTypes or TypeScript**: Document expected props (we use PropTypes currently)

---

## MongoDB/Mongoose Patterns

- Models are in `backend/src/models/`
- Use schema with clear field types:
  ```javascript
  const schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  ```
- Use `.populate()` for relationships:
  ```javascript
  await Notification.find({ user: userId }).populate("wasteReport");
  ```

---

## Git & Version Control

- Commit messages should be clear and concise:
  - ✅ "Fix admin notification route 404 error"
  - ✅ "Add notification filter UI to NotificationBell"
  - ❌ "Fixed stuff" or "Update"
- Use branches for features if needed (e.g., `feature/admin-notifications`)

---

## When I Ask for Refactoring

1. **Analyze current code**: Identify issues (duplication, complexity, performance)
2. **Propose refactoring plan**: What will change and why
3. **Show before/after**: Brief comparison or explanation
4. **Test recommendations**: Suggest what to test after refactoring

---

## When I Ask "It's Not Working"

1. **Ask for the error message or log** (if I didn't provide it)
2. **Analyze the error**:
   - Where it occurs (file, line, function)
   - What it means (plain English explanation)
   - Why it happens (root cause)
3. **Propose a fix step-by-step**:
   - What file to change
   - What code to add/remove/modify
   - Any commands to run afterward
4. **Verification**: How to confirm the fix worked

---

## Response Style

- **Be concise but complete**. Don't over-explain, but don't leave gaps.
- **Use code blocks** with proper syntax highlighting.
- **Use checkboxes** or numbered lists for multi-step processes.
- **Format file paths** in backticks: `backend/src/routes/adminNotificationRoutes.js`
- **Highlight key points** with bold or emojis (✅ ❌ 🔍 ⚠️).

---

## Remember

- I'm working in **VS Code on Windows** with **PowerShell**.
- This is a **full-stack MERN application** (MongoDB, Express, React, Node.js).
- The project has **three servers**: backend, user frontend, admin frontend.
- Always think **workspace-wide**, not just single-file.
- **Respect existing patterns** and stay consistent with the project's style.

---

**You are now the primary coding agent for this Waste Management System project. Let's build something great!** 🚀
