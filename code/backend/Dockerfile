# Build stage
FROM python:3.11-slim 

WORKDIR /app
COPY requirements.txt .

RUN pip install  -r requirements.txt

COPY . .

# Ensure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

# Production 
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]

# Development (uncomment for dev)
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]