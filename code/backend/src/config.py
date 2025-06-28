import os
import logging
import json
import requests
from time import sleep
from fastapi import FastAPI
from minio import Minio
from keycloak import KeycloakAdmin, KeycloakOpenID
from keycloak.exceptions import KeycloakAuthenticationError
from pymongo import MongoClient
from redis import Redis
from pika import BlockingConnection, URLParameters


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Config:
    """Central configuration using os.environ.get"""

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


# RabbitMQ client
class RabbitMQClient:
    def __init__(self, channel, queue_name="notifications"):
        self.channel = channel
        self.queue_name = queue_name
        self._declare_queue()

    def _declare_queue(self):
        """Ensure the queue exists (safe to call many times)"""
        self.channel.queue_declare(queue=self.queue_name, durable=True)
        logger.info(f"✅ Declared queue: {self.queue_name}")

    def send_notification(self, user_id: str, title: str, message: str):
        """Send a user-targeted notification message to RabbitMQ"""
        body = json.dumps({
            "user_id": user_id,
            "title": title,
            "message": message
        })
        self.channel.basic_publish(
            exchange="",
            routing_key=self.queue_name,
            body=body,
            properties={
                "delivery_mode": 2  # Persistent message
            }
        )
        logger.info(f"📤 Notification sent to {user_id}: {title}")


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
    """Initializes Keycloak Admin and OpenID clients"""
    KEYCLOAK_SERVER_URL = os.getenv("KEYCLOAK_SERVER_URL", "http://keycloak:8080/")
    KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "travel-realm")
    KEYCLOAK_ADMIN_USERNAME = os.getenv("KEYCLOAK_ADMIN", "admin")
    KEYCLOAK_ADMIN_PASSWORD = os.getenv("KEYCLOAK_ADMIN_PASSWORD", "admin")
    KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "travel-api")
    KEYCLOAK_CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET", "secret")

        # Admin client for setup
    keycloak_admin = KeycloakAdmin(
        server_url=KEYCLOAK_SERVER_URL,
        username=KEYCLOAK_ADMIN_USERNAME,
        password= KEYCLOAK_ADMIN_PASSWORD,
        realm_name="master",
        verify=True
    )

    try:
        keycloak_openid = KeycloakOpenID(
            server_url=f"{KEYCLOAK_SERVER_URL}",
            client_id=KEYCLOAK_CLIENT_ID,
            realm_name=KEYCLOAK_REALM,
            client_secret_key=KEYCLOAK_CLIENT_SECRET,
            verify=True
        )
        config = keycloak_openid.well_known()
        print("✅ Keycloak OpenID configuration loaded successfully.")
    except Exception as e:
        logger.error(f"[init_keycloak] OpenID connection failed: {e}")
        keycloak_openid = None

    logger.info("✅ Keycloak connection established")
    return {"admin": keycloak_admin, "openid": keycloak_openid}

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
    sleep(15)  # Wait for dependent services to start
    logger.info("🔄 Initializing services...")

    mongo_client = init_mongodb()
    redis_client = init_redis()
    minio_client = init_minio()

    keycloak_clients = init_keycloak()
    keycloak_admin = keycloak_clients["admin"]
    keycloak_client = keycloak_clients["openid"]

    rabbitmq_channel = init_rabbitmq()
    rabbitmq_client = RabbitMQClient(rabbitmq_channel)

except Exception as e:
    logger.critical(f"🔥 Critical service initialization failed: {str(e)}")
    raise
