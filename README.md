# Ennecoded Demos Monorepo

Welcome to the **Ennecoded Demos** monorepo — a playground for experiments, ideas, and explorations that blend creativity and code. This space is designed for trying out small applications, building technical blog demos, and crafting thoughtful tools.

## 🧩 Structure

This monorepo is managed with **pnpm workspaces** and structured as follows:

```
ennecoded-demos/
├── apps/               # All standalone apps and demos
│   ├── hello-world/    # First sample Remix app
├── packages/           # Shared packages (e.g., theme, utils)
├── package.json        # Root dependencies and scripts
├── pnpm-workspace.yaml # Declares workspace structure
```

---

## 🚀 Getting Started

### 1. Clone and install
```bash
git clone https://github.com/your-username/ennecoded-demos.git
cd ennecoded-demos
pnpm install
```

### 2. Start an existing app
```bash
pnpm --filter <app-name> dev
``` 
Eg.
To run the `hello-world` Remix app:
```bash
pnpm --filter hello-world dev
```

---

## ➕ Creating a New App

To scaffold a new app:

```bash
cd apps/
npx create-remix@latest new-app-name
```

Then:
1. Update the app's `package.json` to include:
   ```json
   {
     "name": "new-app-name"
   }
   ```
2. Add the app to the workspace if needed:
   ```yaml
   # pnpm-workspace.yaml
   packages:
     - "apps/*"
     - "packages/*"
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Run it:
   ```bash
   pnpm --filter new-app-name dev
   ```

---


## 📚 App Directory

Each app in the monorepo will have its own README for deeper context. Here’s the list so far:

### 📘 `hello-world`
> A minimal Remix app that was built to test the deployment pipeline.

**To run:**
```bash
pnpm --filter hello-world dev
```

📄 [Read the hello-world README](apps/hello-world/README.md)

---


## 🛠 Dev Tools

```bash
pnpm format     # Run Prettier across the monorepo
pnpm dev        # Start individual apps using --filter
```

---

## ❤️ Author
Built by [Adrienne](https://ennecoded.com) — because sometimes, the best way to learn is to build it yourself.
