# Astro template with Supabase and Stripe

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── layouts/
│   └── lib/
│   └── middleware/
│   └── pages/
│   └── server/
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run stripe:listen`   | Start listening for Stripe events and forward them to `http://localhost:3000/api/payment/stripe-hooks` |
| `npm run stripe:trigger`  | Trigger the `checkout.session.completed` event for testing |
| `npm run type-check`      | Run TypeScript type checking using `tsc --noEmit` |
| `npx prisma migrate deploy`       | Deploy database migrations                      |
| `npx prisma migrate dev`          | Apply pending migrations in development         |
| `npx prisma migrate reset`        | Reset the database and apply all migrations      |


## Setup

1. Copy `.env.sample` into `.env`

2. Go to [Supabase](https://supabase.com/) and create a new project.
3. From `Project Settings -> API` get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. From `Project Settings -> Database` get your `Connection string`. 
- It should be something like this: `postgres://postgres.[ID]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`. 
- Set this as your `DATABASE_URL` by adding `?schema=myschema&pgbouncer=true&connection_limit=1`.The `DIRECT_URL` is the same as the `DATABASE_URL` just change the port to `5432` instead of `6543` and with only the `?schema=myschema`.
- Examples:
    - `DATABASE_URL=postgres://postgres.[ID]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?schema=myschema&pgbouncer=true&connection_limit=1`
    - `DIRECT_URL=postgres://postgres.[ID]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?schema=myschema`
- We are using `myschema` because everything put in the `public` schema will be made public and in order to stop that, we need to enable Row Level Security. But if we use a different schema, there is no need.
- *If you want to use a different postgres database, or if you deploy it on a server ( in this example we use serverless on Vercel ), you might not need the `pgbouncer=true&connection_limit=1`
5. Visit the [Stripe](https://stripe.com/) website and create an account. After that, login to the `Dashboard`, navigate to the `Developers` section. Click on the `API KEYS` tab and get the `secret key` and store it inside `STRIPE_SECRET_KEY` variable.
6. Install the [Stripe cli](https://stripe.com/docs/stripe-cli). After you login, run `npm run stripe:listen`. You will get a message `Your webhook signing secret is whsec_8be0f03b...`. Store that signing secret as `STRIPE_SIGNING_SECRET`.
7. The last step is to go to `Supabase -> Authentication -> Providers` and configure `Github` and `Google` auth.
Now you're good to go!

Enjoy! 