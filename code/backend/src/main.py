import logging
import os
from typing import Optional
from fastapi import FastAPI, HTTPException, status, Depends, Security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from config import (minio_client, keycloak_client, mongo_client, redis_client, rabbitmq_client)
from database_init import initialize_database
from health import router as health_router


from config import init_keycloak




# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app setup with metadata for Swagger
app = FastAPI(
    title="Travel Booking API",
    description="""A comprehensive API for travel bookings including flights, 
    hotels, and packages with user authentication and booking management.""",
    version="1.0.0",
    contact={
        "name": "API Support",
        "email": "support@travelapi.com",
        "url": "https://travelapi.com/support"
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
    },
    servers=[
        {
            "url": "http://localhost:8000",
            "description": "Development server"
        },
        {
            "url": "https://api.travelapi.com",
            "description": "Production server"
        }
    ],
    openapi_tags=[
        {
            "name": "Authentication",
            "description": "User registration and authentication endpoints"
        },
        {
            "name": "Search",
            "description": "Search for available flights, hotels, and packages"
        },
        {
            "name": "Bookings",
            "description": "Manage travel bookings"
        },
        {
            "name": "Users",
            "description": "User account management"
        }
    ]
)

app.include_router(health_router)


# Security scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Models with comprehensive documentation
class UserBase(BaseModel):
    username: str = Field(..., min_length=4, max_length=20, description="Unique username")
    email: EmailStr = Field(..., description="Valid email address")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Strong password")

    class Config:
        schema_extra = {
            "example": {
                "username": "traveler123",
                "email": "user@example.com",
                "password": "Str0ngP@ssw0rd"
            }
        }

class UserResponse(UserBase):
    id: str = Field(..., description="User ID")
    is_active: bool = Field(True, description="Account status")

    class Config:
        schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "username": "traveler123",
                "email": "user@example.com",
                "is_active": True
            }
        }

class BookingBase(BaseModel):
    flight_id: str = Field(..., description="Flight reference ID")
    hotel_id: str = Field(..., description="Hotel reference ID")
    package_id: str = Field(..., description="Package reference ID")

class BookingCreate(BookingBase):
    pass

    class Config:
        schema_extra = {
            "example": {
                "flight_id": "FL12345",
                "hotel_id": "HT67890",
                "package_id": "PKG13579"
            }
        }

class BookingResponse(BookingBase):
    id: str = Field(..., description="Booking ID")
    user_id: str = Field(..., description="User who made the booking")
    status: str = Field("confirmed", description="Booking status")
    created_at: str = Field(..., description="Booking timestamp")

    class Config:
        schema_extra = {
            "example": {
                "id": "607f1f77bcf86cd799439012",
                "user_id": "507f1f77bcf86cd799439011",
                "flight_id": "FL12345",
                "hotel_id": "HT67890",
                "package_id": "PKG13579",
                "status": "confirmed",
                "created_at": "2023-01-01T12:00:00Z"
            }
        }

class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field("bearer", description="Token type")

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        user_data = keycloak_client.verify_token(token)
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_data
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Authentication endpoints
@app.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    tags=["Authentication"],
    responses={
        201: {"description": "User created successfully"},
        400: {"description": "Username or email already exists"},
        500: {"description": "Internal server error"}
    }
)
async def register_user(user: UserCreate):
    """
    Register a new user account.

    - **username**: 4-20 characters, must be unique
    - **email**: must be valid and unique
    - **password**: minimum 8 characters
    """
    try:
        # Check if user exists
        if mongo_client.users.find_one({"username": user.username}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
        
        if mongo_client.users.find_one({"email": user.email}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )

        # Create user in Keycloak
        keycloak_user_id = keycloak_client.create_user(
            user.username,
            user.email,
            user.password
        )

        # Store user in MongoDB
        user_data = {
            "id": keycloak_user_id,
            "username": user.username,
            "email": user.email,
            "is_active": True
        }
        mongo_client.users.insert_one(user_data)

        return user_data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user account"
        )

@app.post(
    "/login",
    response_model=Token,
    summary="Authenticate user",
    tags=["Authentication"],
    responses={
        200: {"description": "Successfully authenticated"},
        401: {"description": "Invalid credentials"},
        500: {"description": "Internal server error"}
    }
)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user and get access token.

    - **username**: Your registered username
    - **password**: Your account password
    """
    try:
        token = keycloak_client.authenticate(form_data.username, form_data.password)
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Store session in Redis (1 hour expiration)
        redis_client.setex(f"session:{form_data.username}", 3600, token)

        return {"access_token": token, "token_type": "bearer"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error during authentication"
        )

# Search endpoints
@app.get(
    "/search",
    summary="Search travel options",
    tags=["Search"],
    responses={
        200: {"description": "List of available options"},
        500: {"description": "Internal server error"}
    }
)
async def search_flights_hotels_packages(
    destination: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    max_price: Optional[float] = None
):
    """
    Search for available flights, hotels, and packages.

    Parameters:
    - **destination**: Location to travel to
    - **date_from**: Start date (YYYY-MM-DD)
    - **date_to**: End date (YYYY-MM-DD)
    - **max_price**: Maximum price filter
    """
    try:
        query = {}
        if destination:
            query["destination"] = destination
        if date_from and date_to:
            query["date"] = {"$gte": date_from, "$lte": date_to}
        if max_price:
            query["price"] = {"$lte": max_price}

        results = list(mongo_client.search_results.find(query))
        return {"results": results}

    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error performing search"
        )

# Booking endpoints
@app.post(
    "/bookings",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new booking",
    tags=["Bookings"],
    dependencies=[Security(get_current_user)],
    responses={
        201: {"description": "Booking created successfully"},
        400: {"description": "Invalid booking data"},
        401: {"description": "Unauthorized"},
        500: {"description": "Internal server error"}
    }
)
async def create_booking(
    booking: BookingCreate,
    current_user: dict = Security(get_current_user)
):
    """
    Create a new travel booking.

    Requires authentication.
    """
    try:
        # Create booking document
        booking_data = booking.dict()
        booking_data["user_id"] = current_user["sub"]  # Keycloak user ID
        booking_data["status"] = "confirmed"
        booking_data["created_at"] = datetime.utcnow().isoformat()

        # Save to MongoDB
        result = mongo_client.bookings.insert_one(booking_data)
        booking_data["id"] = str(result.inserted_id)

        # Generate and upload receipt
        receipt_content = generate_receipt(booking_data)
        receipt_name = f"receipt_{booking_data['id']}.pdf"
        minio_client.put_object(
            "booking-receipts",
            receipt_name,
            receipt_content,
            len(receipt_content)
        )

            # Send notification
        rabbitmq_client.send_notification(
            current_user["sub"],
            "Booking confirmed",
            f"Your booking {booking_data['id']} has been confirmed"
        )
        return booking_data

    except Exception as e:
        logger.error(f"Booking error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating booking"
        )

@app.get(
    "/bookings/{booking_id}",
    response_model=BookingResponse,
    summary="Get booking details",
    tags=["Bookings"],
    dependencies=[Security(get_current_user)],
    responses={
        200: {"description": "Booking details"},
        404: {"description": "Booking not found"},
        401: {"description": "Unauthorized"},
        500: {"description": "Internal server error"}
    }
)
async def get_booking(
    booking_id: str,
    current_user: dict = Security(get_current_user)
):
    """
    Get details of a specific booking.

    Users can only access their own bookings.
    """
    try:
        booking = mongo_client.bookings.find_one({
            "_id": booking_id,
            "user_id": current_user["sub"]
        })
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        return booking
    except Exception as e:
        logger.error(f"Get booking error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving booking"
        )

# User management endpoints
@app.get(
    "/users/me",
    response_model=UserResponse,
    summary="Get current user details",
    tags=["Users"],
    dependencies=[Security(get_current_user)],
    responses={
        200: {"description": "User details"},
        401: {"description": "Unauthorized"},
        500: {"description": "Internal server error"}
    }
)
async def get_current_user_details(current_user: dict = Security(get_current_user)):
    """
    Get details of the currently authenticated user.
    """
    try:
        user = mongo_client.users.find_one({"id": current_user["sub"]})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except Exception as e:
        logger.error(f"Get user error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving user data"
        )





if __name__ == "__main__":
    print("🚀 Starting database initialization...")
    
    # You can either pass the URI directly or let it be read from environment
    success = initialize_database()  # Will automatically use MONGODB_URI from env
    
    if success:
        print("✅ Database initialized successfully with dummy data!")
    else:
        print("❌ Failed to initialize database")

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)