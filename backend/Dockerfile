FROM php:8.2-apache

# 1. Install System Dependencies & SQLite
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite
    
# Install the PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# 2. Enable Apache Rewrite Module
RUN a2enmod rewrite

# 3. ⚠️ FORCE FIX: Enable the MPM Prefork Module
# This fixes the "No MPM loaded" error by explicitly enabling the engine PHP needs.
RUN [ ! -f /etc/apache2/mods-enabled/mpm_prefork.load ] && a2enmod mpm_prefork || true

# 4. Point Apache to the 'public' folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# 5. Set Permissions
WORKDIR /var/www/html
RUN chown -R www-data:www-data /var/www/html