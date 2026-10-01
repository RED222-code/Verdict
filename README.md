# Product Review API

This is a beginner-friendly REST API for users, products, and product reviews. It uses Node.js, Express, MongoDB, Mongoose, and MVC architecture.

The React/Vite frontend is in `frontend/`. The API supports authentication and role-based access. Image fields store filenames or URLs; image upload is not implemented.

## Setup

1. Install Node.js and MongoDB.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and configure it:

```text
PORT=3000
MONGODB_URI=your MongoDB connection string
JWT_SECRET=replace-with-a-long-random-secret
DEV_DATA_IMPORT=false
```

4. Start the API with `npm start`, or use `npm run dev` during development.
5. In another terminal, run `npm install --prefix frontend` and `npm run dev --prefix frontend`.

The base URL is `http://localhost:3000/api/v1`.

## Vercel deployment

Deploy from the repository root so `vercel.json` builds both the API and frontend. The browser uses `/api/v1` on the same domain; deploying only `frontend/` is insufficient.

Set these in Vercel Project Settings → Environment Variables for Production (and Preview if used), then redeploy:

- `MONGODB_URI`: a hosted MongoDB connection string including the database name. A localhost URL cannot reach your computer from Vercel. Ensure the database credentials and network access rules allow the deployment to connect.
- `JWT_SECRET`: a long random server-side secret for authentication. Never use a Vite-prefixed environment variable for secrets.

Local `.env` files are excluded from Git and are not transferred by a Git deployment. The hosted database must contain your products; connecting to a new database does not copy local records. Do not use the destructive development importer to migrate production data.

Check `/api/v1/products?limit=1` after deployment:

- `200` with `data`: working; an empty array means no matching products exist in the selected database.
- `500` with `Database not configured`: `MONGODB_URI` is missing from the deployed API environment.
- `503` with `Database connection failed`: check credentials, cluster availability and network access. Connection attempts time out after 10 seconds.
- HTML or `404`: check the project root, deployed commit and API routing.

## Resources and CRUD

| Resource | List/create | Get/update/delete |
| --- | --- | --- |
| Users | `/users` | `/users/:id` |
| Products | `/products` | `/products/:id` |
| Reviews | `/reviews` | `/reviews/:id` |

Use `GET`, `POST`, `PATCH`, and `DELETE` as appropriate. Product fields include `name`, `price`, `category`, `description`, `quantityAvailable`, and `availabilityStatus`. Reviews include a `rating` from 1 to 5, `userId`, and `productId`.

## Query Features

List endpoints support the following query parameters:

- Basic filtering: `/products?category=electronics`
- Comparison filtering: `/products?price[gte]=500&price[lte]=2000`
- Sorting: `/products?sort=-price` or `/products?sort=category,price`
- Field limiting: `/products?fields=name,price,category`
- Pagination: `/products?page=2&limit=10`

The default sort is newest first (`-dateCreated`). Invalid pages and limits return an API error. A page beyond the available results returns an empty array.

## Alias Routes

- `GET /products/top-rated` sorts by average rating and number of ratings.
- `GET /products/cheap` sorts products by price from low to high.
- `GET /products/available` returns products whose `availabilityStatus` is `available`.

These aliases reuse the normal product list controller.

## Relationships and Statistics

`GET /reviews` populates each review with safe user fields (`name`, `email`, `role`) and useful product fields. Product rating statistics are recalculated when reviews are created, updated, or deleted.

- `GET /products/stats` returns product count, price statistics, and rating totals.
- `GET /products/category-stats` groups product statistics by category.
- `GET /reviews/stats` returns the average rating, review count, and rating distribution.

## Development Data

The sample data is embedded in `import-dev-data.js`. It is intended only for local development and testing.

The importer requires `DEV_DATA_IMPORT=true` and refuses to run when `NODE_ENV=production` or `VERCEL` is set.

```bash
node import-dev-data.js --import
node import-dev-data.js --delete
```

Both commands delete existing data in the configured development database. Do not point them at a production database.

## Project Structure

- `models/` contains schemas, validation, and relationships.
- `controllers/` handles request and response flow.
- `routes/` defines endpoint URLs and middleware.
- `utils/index.js` contains reusable filtering, sorting, field limiting, and pagination.
- `middleware/productAliases.js` configures product shortcut routes.
- `import-dev-data.js` loads or deletes local development data.

## Testing Checklist

Run `npm test`, `npm run build --prefix frontend`, and `npm run lint --prefix frontend`. Regression tests mock database connections and API responses; they do not change database records.

Test CRUD operations, malformed IDs, missing fields, duplicate emails and product names, filtering, sorting, field limiting, pagination, aliases, populated reviews, and all statistics endpoints using Postman or another API client.
