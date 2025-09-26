# QuietSignal

## One-time setup
1) `firebase login`  
2) `firebase use <PROJECT_ID>`  
3) `cd functions && npm ci && cd ../ && npm ci`  

## Local dev
- Terminal A: `cd functions && npm run build && firebase emulators:start --only functions,firestore,hosting`
- Terminal B: `npm run dev` (for Next.js frontend)

## Deploy
- Set GitHub secrets: `PROJECT_ID`, `FIREBASE_TOKEN`, plus API keys.
- Push to `main` to trigger CI.

## Check a URL
- Open the site → paste a URL → see Signal Card.