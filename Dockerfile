FROM php:8.1-apache

WORKDIR /var/www/html

RUN apt-get update -y && apt-get install -y libpq-dev zip unzip
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# RUN rm /etc/apache2/sites-enabled/000-default.conf

COPY apps/ ./

# INSTALL
# RUN composer install
# RUN php artisan view:clear
# RUN chmod 777 storage/logs/
# RUN chmod 777 storage/framework/views/
# RUN chmod 777 storage/framework/sessions/

COPY config/php.ini /usr/local/etc/php/php.ini
COPY config/apache2.conf /etc/apache2/apache2.conf
# COPY config/tracking_xenxor_com_non_ssl.conf /etc/apache2/sites-available

# # CONFIG SITES & SSL
# COPY config/tracking_xenxor_com_ssl.conf /etc/apache2/sites-available
# COPY crt/server-ca-xenxor-crt.pem /etc/ssl/certs/server-ca-xenxor-crt.pem
# COPY crt/server-ca-xenxor-private.key /etc/ssl/certs/server-ca-xenxor-private.key
# COPY crt/server-ca-xenxor-bundle.crt /etc/ssl/certs/server-ca-xenxor-bundle.crt

# APACHE SET CONFIG
# RUN cd /etc/apache2/sites-available
RUN a2enmod ssl
# RUN a2ensite tracking_xenxor_com_non_ssl.conf
# RUN a2ensite tracking_xenxor_com_ssl.conf
RUN a2enmod rewrite

CMD ["apache2-foreground"]