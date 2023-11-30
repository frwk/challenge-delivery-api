FROM adminer:4.8.0
USER root

RUN apk add autoconf gcc g++ make libffi-dev openssl-dev
RUN pecl install mongodb
RUN echo "extension=mongodb.so" > /usr/local/etc/php/conf.d/docker-php-ext-mongodb.ini

RUN sed -i "s|{new|{|" adminer.php
RUN sed -i "s|MongoClient($Li,$zf);$this->error=lang(22);}|}|" adminer.php

USER adminer