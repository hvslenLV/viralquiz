Quick deploy and admin notes

Local development

```bash
npm install
npm run dev
# open http://localhost:5173/
```

Preview production build

```bash
npm run build
npm run preview
# open http://localhost:5173/
```

Deploy options

- Static hosts (Netlify, Vercel, GitHub Pages): build with `npm run build` and deploy the `dist/` folder.
- Vercel: `vercel` will detect Vite and deploy automatically.
- Netlify: connect the repo and set build command `npm run build`, publish directory `dist`.

Admin panel

- Open the app and click the "Админ самбар" button on the home footer.
- Counters are demo-only (in-memory). For production, add a backend to persist analytics and payment confirmations.

Payment flow

- The app includes a mock payment flow: on the payment screen the user is asked to transfer funds to the provided Khan Bank account and include their Gmail in the transfer note.
- After pressing the "Төлбөр төлөх" button the app shows a confirmation screen stating the payment will be verified and the reading sent to the Gmail address provided in the transfer note.

Next steps (recommendations)

- Add a secure backend to verify actual payments and send emails (e.g., serverless function + payment gateway / webhook).
- Persist admin analytics to a database (SQLite, Postgres, or a hosted analytics service).
- Configure environment variables for production (API keys, SMTP credentials) and do not store secrets in the frontend.
