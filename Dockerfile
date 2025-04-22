# Use Python 3.13 slim as base image
FROM python:3.13-slim-bookworm

# Install uv from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set working directory
WORKDIR /app

# Copy project files
COPY pyproject.toml .
COPY uv.lock .
COPY viewer_server.py .
COPY static static/

# Create and activate virtual environment
RUN uv venv /opt/venv
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies using uv
RUN --mount=type=cache,target=/root/.cache/uv \
    uv pip install --system fastapi "uvicorn[standard]"

# Expose the port
EXPOSE 8003

# Mount point for external data
VOLUME /app/static/data

# Run the server
CMD ["uv", "run", "python", "viewer_server.py"] 