FROM python:3.12-slim AS builder

WORKDIR /app

RUN pip install --upgrade pip setuptools wheel
COPY pyproject.toml ./
RUN pip install --no-cache-dir --prefix=/install .

FROM python:3.12-slim AS test-runner

WORKDIR /app

RUN pip install --upgrade pip
COPY pyproject.toml ./
RUN pip install --no-cache-dir ".[dev]"
COPY . .

CMD ["python", "-m", "pytest", "tests/unit/", "-v"]

FROM python:3.12-slim AS runtime

WORKDIR /app

RUN useradd --create-home --shell /bin/bash appuser

COPY --from=builder /install /usr/local
COPY . .

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["sh", "-c", "alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port 8000"]
