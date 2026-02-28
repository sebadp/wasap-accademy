.PHONY: dev lint format typecheck test check

dev:
	uvicorn app.main:app --reload --port 8000

lint:
	ruff check .

format:
	ruff format .

typecheck:
	mypy app/

test:
	pytest tests/ -v

check: lint typecheck test
