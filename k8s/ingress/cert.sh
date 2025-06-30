# Generate wildcard certificate (replace with your actual details)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout wildcard.key -out wildcard.crt \
  -subj "/CN=*.travel-booking.com/O=Travel Booking"

# Create Kubernetes secret
kubectl create secret tls travel-booking-wildcard-tls \
  --key wildcard.key \
  --cert wildcard.crt \
  --namespace=default