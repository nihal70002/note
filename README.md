# React + Vite

## Vercel sitemap generation

`npm run build` automatically runs `scripts/generate-sitemap.mjs` before Vite builds the app.

Set this environment variable in Vercel for Production, Preview, and Development:

```text
VITE_API_BASE_URL=https://your-active-railway-backend-domain
```

The value must be the backend origin without a trailing `/api`. The sitemap script will request `/api/products` and generate canonical product URLs in this format:

```text
https://papercues.in/product/product-name-productId
```

On Vercel, product fetching is required. If the API cannot be reached, the build fails instead of deploying a static-only ecommerce sitemap.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
