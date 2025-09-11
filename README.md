Welcome to your new TanStack app! 


# TO DO

- [ ] Implement dark mode toggle
  - [ ] Fix theme toggle in Header component
  - [ ] Find out why Tailwind is not generating dark mode styles
- [ ] Add animations to page transitions
- [ ] Improve accessibility features

# Getting Started

To run this application:

```bash
pnpm install
pnpm start
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Deploying to Cloudflare Pages / Workers

This project is configured for Cloudflare Pages with Functions (API routes in the `functions/` directory) using `wrangler.toml`.

### Prerequisites

- Install Wrangler: `pnpm add -D wrangler` (or globally `npm i -g wrangler`)
- Authenticate: `npx wrangler login`

### Pages Deployment (Static + Functions)

1. Build the site:
  ```bash
  pnpm build
  ```
2. Preview locally with Cloudflare runtime (functions + KV simulation):
  ```bash
  pnpm cf:pages:preview
  ```
3. Deploy:
  ```bash
  pnpm cf:pages:deploy
  ```

Pages will serve assets from `dist/` and execute `/functions/api/*.ts` as edge functions. The contact form posts to `/api/contact`.

### Environment Variables & Secrets

Use `.env.example` as a template for local development. NEVER commit real secrets.

Server-side secrets must be set with Wrangler (or Cloudflare dashboard):
```bash
pnpm wrangler secret pages put DISCORD_WEBHOOK
pnpm wrangler secret pages put TURNSTILE_SECRET
pnpm wrangler secret pages put SENTRY_AUTH_TOKEN
```

Non-secret build-time vars can go in `wrangler.toml` under `[vars]`.

Last.fm hardening:
- `LASTFM_API_KEY` and `LASTFM_USER` are server-only (no `VITE_` prefix) and used exclusively by `/api/lastfm`.
- Frontend calls `/api/lastfm` so the key never appears in bundles.

Discord & Turnstile:
- `DISCORD_WEBHOOK` and `TURNSTILE_SECRET` are secrets; only the `VITE_TURNSTILE_SITE_KEY` is public.

Rotation after exposure:
If a secret was ever committed, revoke/rotate it (e.g. SENTRY_AUTH_TOKEN), optionally purge the repo history, then redeploy.

### Optional KV for Rate Limiting

Create a KV namespace and bind it if you want distributed rate limiting beyond the in-memory fallback:
```bash
wrangler kv:namespace create RATE_LIMIT_KV
```
Add the resulting id to `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "<namespace_id>"
```

### Migrating to a Full Worker (SSR)

Currently the app ships as a static SPA with an API function. If you later enable SSR via TanStack Start on Workers, you'd:
1. Generate a worker entry (e.g. `dist/worker.js`).
2. Replace `pages_build_output_dir` with `main = "dist/worker.js"` in `wrangler.toml`.
3. Add any durable objects / caches as needed.

Until then, the current setup is optimized for Pages (fast static edge delivery + lightweight API routes).

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
pnpm lint
pnpm format
pnpm check
```


## T3Env


### Usage

```ts
import { env } from "@/env";

console.log(env.VITE_APP_TITLE);
```


### Environment Variables

Add to `.env` (example):

```
VITE_APP_TITLE=Your App
VITE_APP_DESCRIPTION=Description
VITE_APP_AUTHOR=Your Name
VITE_APP_AUTHOR_SHORT=You
# Client Turnstile site key (optional)
VITE_TURNSTILE_SITE_KEY=your_site_key

# Server-only (configure in Cloudflare/hosting dashboard)
DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
TURNSTILE_SECRET=your_turnstile_secret
```

If Turnstile keys are omitted the form still works (without bot protection) provided the webhook is configured.




## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpx shadcn@latest add button
```



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
pnpm add @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
