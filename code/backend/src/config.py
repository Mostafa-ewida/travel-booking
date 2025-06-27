import os
import logging
from minio import Minio
from keycloak import KeycloakOpenID, KeycloakAdmin
from pymongo import MongoClient
from redis import Redis
from pika import BlockingConnection, URLParameters
from fastapi import FastAPI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Config:
    """Central configuration using os.environ.get"""
    
    # Required configurations with no defaults (will raise error if missing)
    @property
    def MONGO_URI(self):
        uri = os.environ.get("MONGO_URI")
        if not uri:
            raise ValueError("MONGO_URI environment variable not set")
        return uri

    @property
    def KEYCLOAK_URL(self):
        url = os.environ.get("KEYCLOAK_URL")
        if not url:
            raise ValueError("KEYCLOAK_URL environment variable not set")
        return url

    # Optional configurations with defaults
    @property
    def REDIS_URL(self):
        return os.environ.get("REDIS_URL", "redis://localhost:6379/0")

    @property
    def RABBITMQ_URL(self):
        return os.environ.get("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")

    @property 
    def MINIO_ENDPOINT(self):
        return os.environ.get("MINIO_ENDPOINT", "localhost:9000")

    @property
    def MINIO_ACCESS_KEY(self):
        return os.environ.get("MINIO_ACCESS_KEY", "minioadmin")

    @property
    def MINIO_SECRET_KEY(self):
        return os.environ.get("MINIO_SECRET_KEY", "minioadmin")

    @property
    def MINIO_SECURE(self):
        return os.environ.get("MINIO_SECURE", "false").lower() == "true"

config = Config()

def init_mongodb():
    """Initialize MongoDB with connection test"""
    try:
        client = MongoClient(config.MONGO_URI)
        client.admin.command('ping')  # Test connection
        logger.info("✅ MongoDB connection established")
        return client
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {str(e)}")
        raise

def init_redis():
    """Initialize Redis client"""
    try:
        client = Redis.from_url(config.REDIS_URL)
        if client.ping():
            logger.info("✅ Redis connection established")
            return client
        raise ConnectionError("Redis ping failed")
    except Exception as e:
        logger.error(f"❌ Redis connection failed: {str(e)}")
        raise

def init_minio():
    """Initialize MinIO client with bucket checks"""
    try:
        client = Minio(
            config.MINIO_ENDPOINT,
            access_key=config.MINIO_ACCESS_KEY,
            secret_key=config.MINIO_SECRET_KEY,
            secure=config.MINIO_SECURE
        )
        
        # Ensure required buckets exist
        buckets = ["user-uploads", "booking-receipts"]
        for bucket in buckets:
            if not client.bucket_exists(bucket):
                client.make_bucket(bucket)
                logger.info(f"Created bucket: {bucket}")
        
        logger.info("✅ MinIO client initialized")
        return client
    except Exception as e:
        logger.error(f"❌ MinIO initialization failed: {str(e)}")
        raise

def init_keycloak():
    """Initialize Keycloak admin and OpenID clients"""
    try:
        # Admin client for setup
        admin = KeycloakAdmin(
            server_url=config.KEYCLOAK_URL,
            username=os.environ.get("KEYCLOAK_ADMIN_USER", "admin"),
            password=os.environ.get("KEYCLOAK_ADMIN_PASSWORD", "admin"),
            realm_name="master",
            verify=True
        )
        
        # OpenID client for authentication
        openid = KeycloakOpenID(
            server_url=config.KEYCLOAK_URL,
            client_id=os.environ.get("KEYCLOAK_CLIENT_ID", "travel-api"),
            realm_name=os.environ.get("KEYCLOAK_REALM", "travel-realm"),
            client_secret_key=os.environ.get("KEYCLOAK_CLIENT_SECRET")
        )
        
        logger.info("✅ Keycloak clients initialized")
        return openid, admin
    except Exception as e:
        logger.error(f"❌ Keycloak initialization failed: {str(e)}")
        raise

def init_rabbitmq():
    """Initialize RabbitMQ connection"""
    try:
        connection = BlockingConnection(URLParameters(config.RABBITMQ_URL))
        channel = connection.channel()
        logger.info("✅ RabbitMQ connection established")
        return channel
    except Exception as e:
        logger.error(f"❌ RabbitMQ connection failed: {str(e)}")
        raise

# Initialize all services
try:
    mongo_client = init_mongodb()
    redis_client = init_redis()
    minio_client = init_minio()
    keycloak_openid, keycloak_admin = init_keycloak()
    rabbitmq_channel = init_rabbitmq()
except Exception as e:
    logger.critical(f"🔥 Critical service initialization failed: {str(e)}")
    raise