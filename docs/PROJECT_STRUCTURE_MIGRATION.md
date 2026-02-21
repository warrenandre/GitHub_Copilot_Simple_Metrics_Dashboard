# Project Structure Migration

## Overview

The project has been reorganized into a clearer frontend/backend separation for better maintainability and development workflow.

## What Changed

### Before (Monolithic Structure)
```
GHCPDashboardApp/
├── src/              # React components
├── public/           # Static assets
├── server.js         # Backend API
├── package.json      # All dependencies
├── vite.config.ts    # Frontend config
└── ...
```

### After (Separated Structure)
```
GHCPDashboardApp/
├── frontend/
│   ├── src/          # React components
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   ├── vite.config.ts
│   └── ...
├── backend/
│   ├── server.js     # Backend API
│   └── package.json  # Backend dependencies
├── package.json      # Root scripts
└── ...
```

## Migration Steps Completed

1. ✅ Created `frontend/` and `backend/` directories
2. ✅ Split `package.json` into three:
   - Root: Contains concurrently and orchestration scripts
   - Frontend: React and frontend dependencies
   - Backend: Express and backend dependencies
3. ✅ Moved frontend files to `frontend/`:
   - `src/`, `public/`, `index.html`
   - `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`
   - `tailwind.config.js`, `postcss.config.js`
4. ✅ Moved backend files to `backend/`:
   - `server.js`
5. ✅ Updated backend server to serve static files from `../frontend/dist/`
6. ✅ Updated documentation (README.md, BACKEND_PROXY.md)
7. ✅ Created separate README files for frontend and backend

## New Commands

### Root Level (Recommended)

Install all dependencies:
```bash
npm run install:all
```

Run both frontend and backend:
```bash
npm run dev
```

Run individually:
```bash
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

Build for production:
```bash
npm run build         # Builds frontend
npm start            # Starts backend (serves API + built frontend)
```

### Frontend Directory

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
```

### Backend Directory

```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start backend server
npm start           # Production mode
```

## Breaking Changes

### For Developers

1. **Import paths remain the same** - All relative imports inside the frontend code work as before since the entire `src/` folder was moved together.

2. **New installation process** - After pulling this change:
   ```bash
   npm run install:all
   ```

3. **New dev command** - Instead of `npm run dev`, now use the same but it runs both servers:
   ```bash
   npm run dev  # Runs frontend + backend via concurrently
   ```

4. **Build output location** - Production builds are now in `frontend/dist/` instead of `dist/`

### For Deployment

1. **Build step** - Still `npm run build` from root
2. **Static files** - Now served from `frontend/dist/` by the backend
3. **No changes to Azure deployment** - The deployment scripts will need minor updates

## Benefits

✅ **Clearer separation of concerns** - Frontend and backend code are isolated
✅ **Independent dependency management** - Each part has its own package.json
✅ **Better IDE support** - TypeScript configs are scoped appropriately
✅ **Easier onboarding** - Developers can understand the architecture faster
✅ **Flexible deployment** - Can deploy frontend and backend separately if needed
✅ **Smaller dependency trees** - Each part only loads what it needs

## File Locations

| File Type | Old Location | New Location |
|-----------|-------------|--------------|
| React components | `src/` | `frontend/src/` |
| API server | `server.js` | `backend/server.js` |
| Frontend config | `vite.config.ts` | `frontend/vite.config.ts` |
| Frontend dependencies | `package.json` | `frontend/package.json` |
| Backend dependencies | `package.json` | `backend/package.json` |
| Build output | `dist/` | `frontend/dist/` |

## Troubleshooting

### Issue: `npm run dev` fails

**Solution:** Make sure all dependencies are installed:
```bash
npm run install:all
```

### Issue: Backend can't find frontend build

**Solution:** Build the frontend first:
```bash
npm run build
```

### Issue: TypeScript errors about missing modules

**Solution:** 
1. Make sure you're in the correct directory
2. Install dependencies: `npm install`
3. Restart TypeScript server in VS Code

### Issue: Port conflicts

**Solution:**
- Frontend uses port 5173
- Backend uses port 3000
- Make sure both ports are available

## Next Steps

1. Update deployment scripts if needed (Deployment/, infra/)
2. Update CI/CD pipelines to use new structure
3. Test end-to-end build and deployment

## Questions?

See the updated documentation:
- [Main README](../README.md)
- [Frontend README](../frontend/README.md)
- [Backend README](../backend/README.md)
- [Backend Proxy Documentation](../docs/BACKEND_PROXY.md)
