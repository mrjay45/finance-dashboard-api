# 💰 Finance Dashboard API

> A powerful, feature-rich API for managing personal finances with beautiful analytics and role-based access control.

<div align="center">

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-13AA52?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Built with ❤️ for financial clarity**

</div>

---

## 📑 Quick Navigation

| 🚀 [Quick Start](#-quick-start) | 📚 [API Docs](#-api-endpoints) | 🏗️ [Structure](#-project-structure) | 📋 [Features](#-features) |
| ------------------------------- | ------------------------------ | ----------------------------------- | ------------------------- |

---

## ✨ Features

<table>
<tr>
<td width="50%">

🔐 **Secure Authentication**

- JWT-based token system
- Password hashing with bcrypt
- 24-hour token expiration

</td>
<td width="50%">

👥 **Role-Based Access**

- Admin: Full control
- Analyst: View & analyze
- Viewer: Read-only access

</td>
</tr>
<tr>
<td width="50%">

💾 **Record Management**

- Create income/expense records
- Filter by type, category & date
- Soft delete protection

</td>
<td width="50%">

📊 **Smart Analytics**

- Financial summaries
- Category breakdowns
- Monthly trends
- Recent activity feed

</td>
</tr>
</table>

---

## 🏗️ Project Structure

<details open>
<summary><b>Click to expand</b></summary>

```
finance-dashboard-system/
├── 📁 src/
│   ├── 🎮 controllers/          # Request handlers
│   │   ├── auth.controller.js
│   │   ├── dashboard.controller.js
│   │   └── record.controller.js
│   ├── 🗄️ db/                   # Database configuration
│   │   └── db.js
│   ├── 🚧 middlewares/          # Express middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── role.middleware.js
│   ├── 📦 models/               # MongoDB schemas
│   │   ├── record.model.js
│   │   └── user.model.js
│   ├── 🛣️ routes/               # API routes
│   │   ├── auth.route.js
│   │   ├── dashboard.routes.js
│   │   └── record.route.js
│   └── 📱 app.js                # Express app setup
├── 🔐 .env                      # Environment variables (local)
├── 📝 .gitignore
├── 📦 package.json
└── 🚀 server.js                 # Entry point
```

</details>

## Installation

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd finance-dashboard-system
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Setup

The `.env` file is already in your root folder. Update it with your credentials:

```env
# MongoDB connection string
MONGOOSE_URL=mongodb://localhost:27017/finance-db
# or use MongoDB Atlas:
# MONGOOSE_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret for token signing (use a strong, random string)
JWT_SECRET=your_super_secret_jwt_key_here_12345678
```

**Tips for `.env`:**

- 🔑 Keep `JWT_SECRET` long and random
- 🗄️ Ensure MongoDB is running before starting the server
- 🚫 Never commit `.env` to version control (already in .gitignore)

## Running the Project

```bash
npm run dev
```

The server will start on `http://localhost:3000` with hot-reload enabled via Nodemon! 🎉

---

## 👥 Role-Based Access Control

### User Roles & Permissions

| Role           | Description             | Permissions                                                 |
| -------------- | ----------------------- | ----------------------------------------------------------- |
| 🔴 **Admin**   | Full system access      | Create, Read, Update, Delete records; Full analytics access |
| 🟡 **Analyst** | Data analysis & viewing | Read records & analytics; Category insights; Trends         |
| 🟢 **Viewer**  | Read-only access        | View records & recent activity only                         |

---

### 🟢 Viewer User - Accessible Routes

Viewer users have **read-only** access to the following endpoints:

#### 🔐 Authentication Routes (No Login Required)

- `POST /api/auth/register` - Create a viewer account
- `POST /api/auth/login` - Login as viewer

#### 📖 Record Viewing

- `GET /api/records/record` - View all records (with filters by type, category, date)
- `GET /api/records/record/:id` - View a specific record

#### 📊 Recent Activity

- `GET /api/dashboard/recent-records` - View 10 most recent transactions

**❌ Viewer Cannot:**

- Create, update, or delete records
- Modify any data
- Access dashboard analytics (summary, trends, category breakdowns)
- Perform admin operations

---

## API Endpoints

<div align="center">

**All endpoints are prefixed with `/api`**

</div>

---

### 🔐 Authentication

#### 🆕 `POST /api/auth/register`

Create a new user account.

| Aspect            | Details               |
| ----------------- | --------------------- |
| **Auth Required** | ❌ No                 |
| **Default Role**  | 👤 viewer             |
| **Roles**         | admin, editor, viewer |

<details>
<summary><b>Request Example</b></summary>

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "viewer"
}
```

</details>

<details>
<summary><b>Success Response (201)</b></summary>

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "viewer"
  }
}
```

</details>

---

#### 🔑 `POST /api/auth/login`

Authenticate user and get JWT token.

| Aspect             | Details             |
| ------------------ | ------------------- |
| **Auth Required**  | ❌ No               |
| **Token Duration** | ⏱️ 24 hours         |
| **Token Storage**  | 🍪 HTTP-only cookie |

<details>
<summary><b>Request Example</b></summary>

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

Sets a `token` cookie for authentication.

```json
{
  "message": "Login successful"
}
```

</details>

---

#### 🚪 `POST /api/auth/logout`

Logout the current user and clear authentication token.

| Aspect            | Details         |
| ----------------- | --------------- |
| **Auth Required** | ✅ Yes          |
| **Clears**        | 🍪 Token cookie |

<details>
<summary><b>Request Example</b></summary>

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json"
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

```json
{
  "message": "Logout successful"
}
```

</details>

---

### 💾 Records

✅ **All record endpoints require authentication**

#### ➕ `POST /api/records/record`

Create a new financial record.

| Field        | Type   | Required | Options                       |
| ------------ | ------ | -------- | ----------------------------- |
| **amount**   | Number | ✅ Yes   | Positive integer              |
| **type**     | String | ✅ Yes   | `income`, `expense`           |
| **category** | String | ✅ Yes   | salary, freelance, food, etc. |
| **date**     | Date   | ✅ Yes   | YYYY-MM-DD format             |
| **note**     | String | ❌ No    | Any text                      |

**Allowed Roles**: 🔒 Admin only

<details>
<summary><b>Request Example</b></summary>

```bash
curl -X POST http://localhost:3000/api/records/record \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "type": "income",
    "category": "salary",
    "date": "2024-05-20",
    "note": "Monthly salary"
  }'
```

</details>

<details>
<summary><b>Success Response (201)</b></summary>

```json
{
  "message": "Record created successfully",
  "record": {
    "_id": "60d0fe4f5311236168a109cb",
    "amount": 100,
    "type": "income",
    "category": "salary",
    "date": "2024-05-20T00:00:00.000Z",
    "note": "Monthly salary",
    "createdBy": "60d0fe4f5311236168a109ca",
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "2024-05-20T12:00:00.000Z",
    "updatedAt": "2024-05-20T12:00:00.000Z"
  }
}
```

</details>

---

#### 📖 `GET /api/records/record`

Retrieve all financial records with powerful filtering options.

**Allowed Roles**: admin, analyst, viewer

| Parameter     | Type   | Description                                 |
| ------------- | ------ | ------------------------------------------- |
| **type**      | String | Filter by `income` or `expense`             |
| **category**  | String | Filter by category (salary, food, etc.)     |
| **startDate** | Date   | Filter records from this date (YYYY-MM-DD)  |
| **endDate**   | Date   | Filter records until this date (YYYY-MM-DD) |
| **page**      | Number | Page number (default: 1)                    |
| **limit**     | Number | Records per page (default: 10)              |

<details>
<summary><b>Request Example</b></summary>

```bash
curl "http://localhost:3000/api/records/record?type=expense&category=food&page=1&limit=5"
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

```json
{
  "totalRecords": 1,
  "records": [
    {
      "_id": "60d0fe4f5311236168a109cc",
      "amount": 25,
      "type": "expense",
      "category": "food",
      "date": "2024-05-19T00:00:00.000Z",
      "note": "Lunch",
      "createdBy": "60d0fe4f5311236168a109ca",
      "isDeleted": false,
      "deletedAt": null,
      "createdAt": "2024-05-19T12:00:00.000Z",
      "updatedAt": "2024-05-19T12:00:00.000Z"
    }
  ]
}
```

</details>

---

#### 🔍 `GET /api/records/record/:id`

Get detailed information about a single record.

**Allowed Roles**: admin, analyst, viewer

<details>
<summary><b>Request Example</b></summary>

```bash
curl "http://localhost:3000/api/records/record/60d0fe4f5311236168a109cc"
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

```json
{
  "record": {
    "_id": "60d0fe4f5311236168a109cc",
    "amount": 25,
    "type": "expense",
    "category": "food",
    "date": "2024-05-19T00:00:00.000Z",
    "note": "Lunch",
    "createdBy": "60d0fe4f5311236168a109ca",
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "2024-05-19T12:00:00.000Z",
    "updatedAt": "2024-05-19T12:00:00.000Z"
  }
}
```

</details>

---

#### ✏️ `PATCH /api/records/record/:id`

Update one or more fields of a record.

**Allowed Roles**: 🔒 Admin only

**Updatable Fields**: amount, type, category, date, note

<details>
<summary><b>Request Example</b></summary>

```json
{
  "amount": 30,
  "note": "Lunch with a client"
}
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

```json
{
  "message": "Record updated successfully",
  "record": {
    "_id": "60d0fe4f5311236168a109cc",
    "amount": 30,
    "type": "expense",
    "category": "food",
    "date": "2024-05-19T00:00:00.000Z",
    "note": "Lunch with a client",
    "createdBy": "60d0fe4f5311236168a109ca",
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "2024-05-19T12:00:00.000Z",
    "updatedAt": "2024-05-20T13:00:00.000Z"
  }
}
```

</details>

---

#### 🗑️ `DELETE /api/records/record/:id`

Safely delete a record (soft delete - data is preserved).

**Allowed Roles**: 🔒 Admin only

<details>
<summary><b>Request Example</b></summary>

```bash
curl -X DELETE "http://localhost:3000/api/records/record/60d0fe4f5311236168a109cc"
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

```json
{
  "message": "Record deleted successfully"
}
```

</details>

---

### 📊 Dashboard Analytics

✅ **All dashboard endpoints require authentication**

#### 💹 `GET /api/dashboard/summary`

Get a quick financial overview: total income, expenses, and net balance.

**Allowed Roles**: admin, analyst

<details>
<summary><b>Request Example</b></summary>

```bash
curl "http://localhost:3000/api/dashboard/summary" \
  -H "Accept: application/json"
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

```json
{
  "totalIncome": 5000,
  "totalExpense": 1500,
  "netBalance": 3500
}
```

</details>

---

#### 🏷️ `GET /api/dashboard/category-summary`

Analyze spending by category - see where your money goes!

**Allowed Roles**: admin, analyst

<details>
<summary><b>Request Example</b></summary>

```bash
curl "http://localhost:3000/api/dashboard/category-summary"
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

```json
{
  "allCategoriesSummary": [
    {
      "category": "salary",
      "totalAmount": 5000,
      "count": 1
    },
    {
      "category": "food",
      "totalAmount": 500,
      "count": 10
    }
  ]
}
```

</details>

---

#### 📈 `GET /api/dashboard/category-summary/:category`

Deep dive into a specific category's performance.

**Allowed Roles**: admin, analyst

<details>
<summary><b>Request Example</b></summary>

```bash
curl "http://localhost:3000/api/dashboard/category-summary/food"
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

```json
{
  "categorySummary": [
    {
      "category": "food",
      "totalAmount": 500,
      "count": 10
    }
  ]
}
```

</details>

---

#### 📊 `GET /api/dashboard/trends`

Track your income vs. expenses over time (monthly breakdown).

**Allowed Roles**: admin, analyst

<details>
<summary><b>Request Example</b></summary>

```bash
curl "http://localhost:3000/api/dashboard/trends"
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

```json
{
  "trends": [
    {
      "month": "2024-04",
      "income": 5000,
      "expense": 1200
    },
    {
      "month": "2024-05",
      "income": 5000,
      "expense": 1500
    }
  ]
}
```

</details>

---

#### ⏱️ `GET /api/dashboard/recent-records`

See your 10 most recent transactions at a glance.

**Allowed Roles**: admin, analyst, viewer

<details>
<summary><b>Request Example</b></summary>

```bash
curl "http://localhost:3000/api/dashboard/recent-records"
```

</details>

<details>
<summary><b>Success Response (200)</b></summary>

```json
{
  "recentRecords": [
    {
      "_id": "60d0fe4f5311236168a109cd",
      "amount": 50,
      "type": "expense",
      "category": "transportation",
      "date": "2024-05-20T00:00:00.000Z",
      "note": "Taxi",
      "createdBy": {
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "createdAt": "2024-05-20T14:00:00.000Z",
      "updatedAt": "2024-05-20T14:00:00.000Z"
    }
  ]
}
```

</details>

---

<div align="center">

## 🎉 You're All Set!

**Happy Finance Tracking! 💪**

</div>
