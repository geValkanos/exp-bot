SHELL := /bin/bash
SOURCE_ENV := source env/bin/activate

env:
	nodeenv --node=18.12.1 --prebuilt env
	${SOURCE_ENV} && npm install

lint: env
	${SOURCE_ENV} && npm run lint

db: env
	docker-compose up -d db
	sleep 3
	${SOURCE_ENV} && npx db-migrate up -e pg-dev

run_dev: env db
	${SOURCE_ENV} && npm run start:dev

tests: env db
	set -o pipefail && ${SOURCE_ENV} && npm run test