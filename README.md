# S K Corporation - Django + Bootstrap Website

Modern responsive website for S K Corporation, built with Django and Bootstrap 5.

## Included pages
- Home
- About
- Products
- Services
- Contact

## Included features
- Responsive Bootstrap 5 layout
- Mobile navigation
- Animated hero, cards and scroll reveal effects
- Django models for products, services and contact enquiries
- Django admin for content management
- SQLite database for local development
- WhiteNoise static-file support for deployment
- Branding and partner/product imagery sourced from the supplied S K Corporation company profile PDF

## Run locally

```bash
python -m venv venv
venv\\Scripts\\activate       # Windows
# source venv/bin/activate     # Linux/macOS
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_site
python manage.py runserver
```

Open http://127.0.0.1:8000/

Admin: http://127.0.0.1:8000/admin/
Create a superuser with:

```bash
python manage.py createsuperuser
```

## Production notes
Set `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`, and `DJANGO_ALLOWED_HOSTS` in the environment. Run `python manage.py collectstatic --noinput` before starting Gunicorn.
