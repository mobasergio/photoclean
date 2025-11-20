# Turso Database Setup Instructions

## Step 1: Install Turso CLI

Visit https://docs.turso.tech/cli/installation and follow the installation instructions for Windows.

Or download directly from: https://github.com/tursodatabase/turso-cli/releases

## Step 2: Authenticate

Open a new terminal and run:
```bash
turso auth signup
```

This will open a browser window for authentication.

## Step 3: Create Database

```bash
turso db create photoclean
```

## Step 4: Get Database URL

```bash
turso db show photoclean --url
```

Copy the URL (it will look like: `libsql://photoclean-[username].turso.io`)

## Step 5: Create Auth Token

```bash
turso db tokens create photoclean
```

Copy the token (it's a long string)

## Step 6: Create .env File

Create a `.env` file in the root of your project with:

```
TURSO_DATABASE_URL=your_database_url_here
TURSO_AUTH_TOKEN=your_auth_token_here
```

## Alternative: Use Turso Dashboard

You can also create a database and get credentials from the web dashboard:
https://turso.tech/app

Once you have the credentials, paste them into the `.env` file and the code will be ready to use!
