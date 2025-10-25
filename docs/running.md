# Local dev setup


## Backend

Must do first to have activated venv and local Python dependencies.

```bash
# From /backend
cd ./backend

# Create virtual environment
uv venv

# Activate the environment
source .venv/bin/activate

# Install dependencies
uv sync

# Start the FastAPI development server (after database)
uvicorn app.main:app --reload

# Automatic Interactive Docs (Swagger UI)
http://localhost:8000/docs

# Run backend tests (cd ./backend)
bash ./scripts/test.sh
```

## Database

```bash
# From project root
cd ~/Desktop/githubcities

# Run just Postgres database service
docker compose up -d database adminer

# From /backend
cd ./backend

# Needs activated venv and Python dependencies

# Await db, run migrations and seed (must have .env), reminder: MUST rerun after delete db in dev
bash scripts/prestart.sh

# Run just database migrations
alembic upgrade head

# If changed models generate migration
alembic revision --autogenerate -m "e.g. Add column last_name to User model"
```

## Frontend

```bash
# From project root
cd ~/Desktop/githubcities

# Generate client (needs activated venv)
bash scripts/generate-client.sh

# From /frontend
cd ./frontend

# Run dev
pnpm dev
```
