#!/usr/bin/env bash
# Exit on error
set -o errexit

# Cài đặt thư viện Python
pip install -r requirements.txt

# Gom file tĩnh (CSS/JS cho trang Admin)
python manage.py collectstatic --no-input

# Cập nhật Database
python manage.py migrate