FROM php:8.2-fpm

# Install system dependencies and SQLite drivers
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite mbstring exif pcntl bcmath gd

WORKDIR /var/www

# Copy the application code
COPY . /var/www

# Fix permissions
RUN chown -R www-data:www-data /var/www