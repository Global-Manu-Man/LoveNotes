#!/bin/sh

# Replace environment variables in the built JavaScript files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_SUPABASE_URL_PLACEHOLDER|$VITE_SUPABASE_URL|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_SUPABASE_ANON_KEY_PLACEHOLDER|$VITE_SUPABASE_ANON_KEY|g" {} \;

# Start nginx
exec "$@"