#! /usr/bin/env bash

set -e
set -x

# Generate openapi.json with FastAPI
cd backend
python -c "import app.main; import json; print(json.dumps(app.main.app.openapi()))" > ../openapi.json
cd ..

# Move to Next.js app root
mv openapi.json frontend/apps/web/

# Navigate to Next.js app
cd frontend/apps/web

# Generate client
pnpm run generate-client

# Format client
pnpm exec prettier --write ./client
