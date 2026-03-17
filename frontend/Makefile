.PHONY: dev kill-dev clean restart-dev

## Start the Next.js dev server
dev:
	npm run dev

## Kill stuck Next.js process on port 3000
kill-dev:
	@PID=$$(lsof -ti :3000 -s TCP:LISTEN); \
	if [ -n "$$PID" ]; then \
		echo "Killing process $$PID on port 3000..."; \
		kill -9 $$PID; \
	else \
		echo "No process found on port 3000"; \
	fi
	@rm -f .next/dev/lock

## Remove .next build cache
clean:
	@rm -rf .next
	@echo "Cleaned .next/"

## Kill, clean, and restart — one command to rule them all
restart-dev: kill-dev clean dev
