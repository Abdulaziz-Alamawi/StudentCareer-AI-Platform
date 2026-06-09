FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# System deps (for prisma engine + builds)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Generate the Prisma client at build time
RUN prisma generate

EXPOSE 8000

# Push schema then start the server (suitable for Railway/containers)
CMD ["sh", "-c", "prisma db push --skip-generate && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
