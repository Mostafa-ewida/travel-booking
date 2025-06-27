from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from config import (
    mongo_client,
    redis_client,
    minio_client,
    keycloak_openid,
    rabbitmq_channel
)

router = APIRouter(tags=["Health"])

@router.get("/health")
async def check_health():
    """Simple health check for all services"""
    status = {
        "mongodb": "healthy",
        "redis": "healthy",
        "minio": "healthy",
        "keycloak": "healthy",
        "rabbitmq": "healthy",
        "status": "healthy"
    }
    
    try:
        # Check MongoDB
        mongo_client.admin.command('ping')
    except Exception as e:
        status["mongodb"] = f"unhealthy: {str(e)}"
        status["status"] = "degraded"

    try:
        # Check Redis
        redis_client.ping()
    except Exception as e:
        status["redis"] = f"unhealthy: {str(e)}"
        status["status"] = "degraded"

    try:
        # Check MinIO
        minio_client.list_buckets()
    except Exception as e:
        status["minio"] = f"unhealthy: {str(e)}"
        status["status"] = "degraded"

    try:
        # Check Keycloak
        keycloak_openid.well_know()
    except Exception as e:
        status["keycloak"] = f"unhealthy: {str(e)}"
        status["status"] = "degraded"

    try:
        # Check RabbitMQ
        rabbitmq_channel.connection.is_open
    except Exception as e:
        status["rabbitmq"] = f"unhealthy: {str(e)}"
        status["status"] = "degraded"

    return JSONResponse(
        content=status,
        status_code=200 if status["status"] == "healthy" else 207
    )

@router.get("/health/liveness")
async def liveness_check():
    """Simple check if app is running"""
    return {"status": "alive"}

@router.get("/health/readiness")
async def readiness_check():
    """Check if app is ready to handle requests"""
    try:
        mongo_client.admin.command('ping')
        return {"status": "ready"}
    except Exception as e:
        raise HTTPException(503, detail=f"Not ready: {str(e)}")