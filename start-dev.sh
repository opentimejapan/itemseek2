#!/bin/bash

echo "🚀 Starting ItemSeek2 Development Environment"
echo "==========================================="

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    fi
    return 0
}

# Check required ports
echo "Checking ports..."
ports=(3000 3002 3003 3004 3005 3100)
all_clear=true

for port in "${ports[@]}"; do
    if ! check_port $port; then
        all_clear=false
    fi
done

if [ "$all_clear" = false ]; then
    echo "❌ Please free up the ports listed above and try again."
    exit 1
fi

# Check if backend is running
echo "Checking backend..."
if ! curl -s http://localhost:3100/health > /dev/null; then
    echo "⚠️  Backend is not running!"
    echo "Please start the backend first:"
    echo "  cd ../itemseek2-backend"
    echo "  npm run dev"
    exit 1
fi

echo "✅ Backend is running"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Start all apps
echo "🚀 Starting all apps..."
pnpm dev

echo "

✅ ItemSeek2 is running!

Frontend Apps:
- Main App: http://localhost:3000
- Inventory: http://localhost:3002
- Admin: http://localhost:3003
- AI Connector: http://localhost:3004
- User Manager: http://localhost:3005

Backend API: http://localhost:3100

Demo Credentials:
- Admin: admin@demo.com / demo123456
- Manager: manager@demo.com / demo123456
"