set dotenv-load := true
compose := "docker compose"
running-services := `docker compose ps --status=running --services`
exec := if running-services =~ "node" {
   compose + " exec node "
} else {
   compose + " run -T --rm node "
}
status := if running-services =~ "node" {
   "up"
} else {
   "down"
}

[private]
default:
    @just help

[private]
help:
    @just --list

[private]
alias c := compose
# Run compose commands
compose +ARGS:
    {{compose}} {{ARGS}}

# Exec commands in the node container
exec +ARGS:
    {{exec}} {{ARGS}}

[private]
alias i := install
# Install dependencies
install:
    @just npm install

# Run postgres commands
postgres:
    {{compose}} exec db postgres -u$DB_USER -p$DB_PASSWORD

# Build docker services
build *ARGS:
    {{compose}} build

# Run docker services
up *ARGS:
    {{compose}} up -d {{ARGS}}

# Down docker services
down *ARGS:
    {{compose}} down {{ARGS}}

# Initialize the project
init:
    @just build
    @just npm install
    @just up
    @just reset

# Launch a bash shell in the node container
sh:
    {{exec}} /bin/bash

# Use NPM
npm *instructions:
    {{exec}} npm {{instructions}}
# Use NPX
npx *instructions:
    {{exec}} npx {{instructions}}

# Stop and restart services to include configuration changes
restart *ARGS:
    @{{compose}} stop {{ARGS}}
    @{{compose}} start {{ARGS}}

# Apply database migrations
migrate:
	@just npx sequelize-cli db:migrate

# Undo all database migrations
undo:
	@just npx 
    
# Seed the database
seed:
	@just npx sequelize-cli db:seed:all

reset:
    @just undo
    @just migrate
    @just seed