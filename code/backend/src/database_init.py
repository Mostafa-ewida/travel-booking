import os
import pymongo
from pymongo import MongoClient
from urllib.parse import urlparse
from datetime import datetime, timedelta
import random
from faker import Faker
import logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_mongodb_uri() -> str:
    """Get MongoDB URI from environment variables with validation"""
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        raise ValueError("MONGODB_URI environment variable not set")
    
    # Basic validation of the URI format
    if not mongodb_uri.startswith("mongodb://") and not mongodb_uri.startswith("mongodb+srv://"):
        raise ValueError("Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://")
    
    return mongodb_uri

def get_db_name_from_uri(mongodb_uri: str) -> str:
    """Extract database name from MongoDB URI with validation"""
    try:
        parsed_uri = urlparse(mongodb_uri)
        db_name = parsed_uri.path.lstrip('/')
        if not db_name:
            raise ValueError("No database name found in URI")
        
        # Remove any query parameters if present
        if '?' in db_name:
            db_name = db_name.split('?')[0]
            
        return db_name
    except Exception as e:
        logger.error(f"Error parsing MongoDB URI: {str(e)}")
        raise

def initialize_database(mongodb_uri: Optional[str] = None) -> bool:
    """
    Initialize MongoDB with dummy data
    
    Args:
        mongodb_uri: Optional MongoDB URI. If not provided, will try to get from environment.
    
    Returns:
        bool: True if initialization succeeded, False otherwise
    """
    try:
        # Get MongoDB URI
        if not mongodb_uri:
            mongodb_uri = get_mongodb_uri()
        
        # Connect to MongoDB and get database name
        db_name = get_db_name_from_uri(mongodb_uri)
        client = MongoClient(mongodb_uri)
        db = client[db_name]
        
        logger.info(f"Successfully connected to MongoDB database: {db_name}")
        
        # Create collections if they don't exist
        collections = ["users", "flights", "hotels", "packages", "bookings", "search_results"]
        for collection in collections:
            if collection not in db.list_collection_names():
                db.create_collection(collection)
                logger.info(f"Created collection: {collection}")
        
        # Clear existing data (for demo purposes)
        for collection in collections:
            db[collection].delete_many({})
        
        logger.info("Cleared existing data from collections")
        
        # Create indexes
        db.users.create_index("username", unique=True)
        db.users.create_index("email", unique=True)
        db.flights.create_index([("departure_city", 1), ("arrival_city", 1)])
        db.bookings.create_index("user_id")
        db.bookings.create_index([("user_id", 1), ("status", 1)])
        
        logger.info("Created necessary indexes")
        
        # Initialize Faker
        fake = Faker()
        
        # Generate dummy users
        users = []
        for i in range(1, 21):
            user = {
                "id": f"user_{i:03d}",
                "username": f"user{i}",
                "email": f"user{i}@example.com",
                "is_active": True,
                "first_name": fake.first_name(),
                "last_name": fake.last_name(),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            users.append(user)
        
        db.users.insert_many(users)
        logger.info(f"Inserted {len(users)} dummy users")
        
        # Generate dummy flights
        cities = ["New York", "London", "Paris", "Tokyo", "Dubai", 
                 "Singapore", "Sydney", "Los Angeles", "Hong Kong", "Berlin"]
        flights = []
        
        for i in range(1, 51):
            departure_city = random.choice(cities)
            arrival_city = random.choice([c for c in cities if c != departure_city])
            departure_time = datetime.utcnow() + timedelta(days=random.randint(1, 30))
            
            flight = {
                "id": f"FL{i:04d}",
                "airline": fake.company(),
                "flight_number": f"{random.choice(['AA', 'DL', 'UA', 'BA', 'LH'])}{random.randint(100, 999)}",
                "departure_city": departure_city,
                "arrival_city": arrival_city,
                "departure_time": departure_time,
                "arrival_time": departure_time + timedelta(hours=random.randint(2, 12)),
                "price": round(random.uniform(100, 1000), 2),
                "seats_available": random.randint(5, 50),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            flights.append(flight)
        
        db.flights.insert_many(flights)
        logger.info(f"Inserted {len(flights)} dummy flights")
        
        # Generate dummy hotels
        hotels = []
        for i in range(1, 31):
            city = random.choice(cities)
            hotel = {
                "id": f"HT{i:04d}",
                "name": f"{fake.company()} Hotel",
                "city": city,
                "address": fake.address(),
                "price_per_night": round(random.uniform(50, 500), 2),
                "rating": round(random.uniform(1, 5), 1),
                "amenities": random.sample(["Pool", "Spa", "Gym", "Restaurant", "WiFi", "Parking"], k=random.randint(2, 5)),
                "rooms_available": random.randint(1, 20),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            hotels.append(hotel)
        
        db.hotels.insert_many(hotels)
        logger.info(f"Inserted {len(hotels)} dummy hotels")
        
        # Generate dummy packages
        packages = []
        for i in range(1, 21):
            flight = random.choice(flights)
            hotel = random.choice([h for h in hotels if h["city"] == flight["arrival_city"]])
            
            package = {
                "id": f"PKG{i:03d}",
                "name": f"{flight['departure_city']} to {flight['arrival_city']} Package",
                "flight_id": flight["id"],
                "hotel_id": hotel["id"],
                "duration_days": random.randint(3, 14),
                "price": round(flight["price"] + (hotel["price_per_night"] * 3 * random.uniform(0.8, 1.2)), 2),
                "description": fake.text(),
                "included": random.sample([
                    "Flight", "Hotel", "Airport Transfer", 
                    "City Tour", "Breakfast", "Travel Insurance"
                ], k=random.randint(2, 4)),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            packages.append(package)
        
        db.packages.insert_many(packages)
        logger.info(f"Inserted {len(packages)} dummy packages")
        
        # Generate dummy bookings
        bookings = []
        statuses = ["confirmed", "cancelled", "completed", "pending"]
        
        for i in range(1, 51):
            user = random.choice(users)
            package = random.choice(packages)
            
            booking_date = datetime.utcnow() - timedelta(days=random.randint(1, 60))
            
            booking = {
                "id": f"BK{i:05d}",
                "user_id": user["id"],
                "flight_id": package["flight_id"],
                "hotel_id": package["hotel_id"],
                "package_id": package["id"],
                "status": random.choice(statuses),
                "total_price": package["price"] * random.uniform(0.9, 1.1),
                "booking_date": booking_date,
                "travel_date": booking_date + timedelta(days=random.randint(7, 60)),
                "payment_status": "paid" if random.random() > 0.2 else "pending",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            bookings.append(booking)
        
        db.bookings.insert_many(bookings)
        logger.info(f"Inserted {len(bookings)} dummy bookings")
        
        # Generate search results (aggregated data)
        search_results = []
        for flight in random.sample(flights, 10):
            city = flight["arrival_city"]
            matching_hotels = [h for h in hotels if h["city"] == city]
            matching_packages = [p for p in packages if p["flight_id"] == flight["id"]]
            
            if matching_hotels and matching_packages:
                result = {
                    "type": "bundle",
                    "flight": flight,
                    "hotel": random.choice(matching_hotels),
                    "package": random.choice(matching_packages),
                    "total_price": round(flight["price"] + random.choice(matching_hotels)["price_per_night"] * 3, 2),
                    "discount": round(random.uniform(5, 15), 2),
                    "created_at": datetime.utcnow()
                }
                search_results.append(result)
        
        db.search_results.insert_many(search_results)
        logger.info(f"Inserted {len(search_results)} dummy search results")
        
        logger.info("Database initialization completed successfully!")
        return True
    
    except pymongo.errors.ConnectionFailure as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Error during database initialization: {str(e)}")
        return False

        