## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── features/
│   ├── layouts/
│   └── lib/
│   └── middleware/
│   └── pages/
└── package.json
```

Inside `components` we have the `shadcn/ui` components.

Inside `features` we colocate the files for each `feature`:
- api -> will contain the `ky` fetch requests
- mutations -> will containt the `useMutation` hooks from `react-query`
- server -> will contain the `db` access
- queries -> will contain the `useQueries` hooks from `react-query`
- other components that are shared by the feature

Inside `layouts` we will define different layouts that we will use inside the `pages`.

Inside `lib` we will put our `stripe`, `db` and other library instances + different helpers.

Inside `/pages` we can use `.astro` files to define our pages. In astro, the code between `---` is executed on the server. There we can the db. The `filename.astro` is transformed to our `/filename` route.
If we want to create an api, we can can create a `filename.ts` file that exports http verbes like:

```ts
export const GET: APIRoute = ({ params, request, locals }) => {
  return new Response(JSON.stringify({
      message: "This was a GET!"
    })
  )
}

export const POST: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({
      message: "This was a POST!"
    })
  )
}

export const DELETE: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({
      message: "This was a DELETE!"
    })
  )
}

export const ALL: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({
      message: `This was a ${request.method}!`
    })
  )
}
```

Notice that in astro we return the browser native `Response`. So if we want to return JSON, we can do it like this:
```ts

return new Response(JSON.stringify({ "data": "This is JSON" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
```


Inside `middleware`, we have setup the authentication middleware using `supabase`. Now, inside the pages, we can access the user via `locals.user` from `Astro` or from `APIRoute`.

