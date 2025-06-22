#!/bin/bash

echo "🧪 ItemSeek2 Integration Test"
echo "============================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backend health check
echo -n "Testing backend health endpoint... "
if curl -s http://localhost:3100/health | grep -q "ok"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Backend is not running. Please start it first."
    exit 1
fi

# Test authentication
echo -n "Testing authentication... "
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3100/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@demo.com","password":"demo123456"}')

if echo "$AUTH_RESPONSE" | grep -q "accessToken"; then
    echo -e "${GREEN}✓${NC}"
    TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${RED}✗${NC}"
    echo "Authentication failed. Have you seeded the database?"
    exit 1
fi

# Test protected endpoint
echo -n "Testing protected endpoint... "
USER_RESPONSE=$(curl -s http://localhost:3100/api/users/me \
    -H "Authorization: Bearer $TOKEN")

if echo "$USER_RESPONSE" | grep -q "admin@demo.com"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Failed to access protected endpoint"
fi

# Test inventory endpoint
echo -n "Testing inventory endpoint... "
INVENTORY_RESPONSE=$(curl -s http://localhost:3100/api/inventory \
    -H "Authorization: Bearer $TOKEN")

if echo "$INVENTORY_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Failed to access inventory endpoint"
fi

echo ""
echo "✅ Integration tests complete!"
echo ""
echo "You can now:"
echo "1. Open http://localhost:3000 to login"
echo "2. Use demo credentials: admin@demo.com / demo123456"
echo "3. Navigate between the different apps"