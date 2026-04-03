#!/bin/sh
set -e

# Start the Next.js client
cd /app/client && bun run start &
CLIENT_PID=$!

# Start the Express server
cd /app/server && bun src/index.ts &
SERVER_PID=$!

# If either process exits, shut down the other and exit
trap "kill $CLIENT_PID $SERVER_PID 2>/dev/null; exit 1" TERM INT

# Wait for either process to exit (POSIX-compatible, no `wait -n`)
while kill -0 $CLIENT_PID 2>/dev/null && kill -0 $SERVER_PID 2>/dev/null; do
    sleep 1
done

# One process died — kill the other and exit with failure
kill $CLIENT_PID $SERVER_PID 2>/dev/null
exit 1
