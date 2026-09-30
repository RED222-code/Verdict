# Product Review API

This is a beginner-friendly REST API for users, products, and product reviews. It uses Node.js, Express, MongoDB, Mongoose, and MVC architecture.

The API does not include a frontend, authentication, or image uploads. Image fields store filenames or URLs only.

## Setup

1. Install Node.js and MongoDB.
2. Run `npm install`.
3. Create a `.env` file:

```text
PORT=3000
MONGODB_URI=your MongoDB connection string
DEV_DATA_IMPORT=true
```

4. Start the API with `npm start`, or use `npm run dev` during development.

The base URL is `http://localhost:3000/api/v1`.

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

The default sort is `dateCreated`. Invalid pages and limits return an API error. A page beyond the available results also returns an error instead of an empty success response.

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

The sample data is in `dev-data/data/`. It is intended only for local development and testing.

The importer requires `DEV_DATA_IMPORT=true` and refuses to run when `NODE_ENV=production`.

```bash
node import-dev-data.js --import
node import-dev-data.js --delete
```

Both commands delete existing data in the configured development database. Do not point them at a production database.

## Project Structure

- `models/` contains schemas, validation, and relationships.
- `controllers/` handles request and response flow.
- `routes/` defines endpoint URLs and middleware.
- `utils/apiFeatures.js` contains reusable filtering, sorting, field limiting, and pagination.
- `middleware/productAliases.js` configures product shortcut routes.
- `import-dev-data.js` loads or deletes local development data.

## Testing Checklist

Test CRUD operations, malformed IDs, missing fields, duplicate emails and product names, filtering, sorting, field limiting, pagination, aliases, populated reviews, and all statistics endpoints using Postman or another API client.
