# Django Blog Platform

## Setup

1. Create virtual environment and install dependencies

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Apply migrations and create superuser

```bash
python manage.py migrate
python manage.py createsuperuser
```

3. Run development server

```bash
python manage.py runserver
```

The application uses PostgreSQL. Configure database credentials via environment variables:
`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`.
