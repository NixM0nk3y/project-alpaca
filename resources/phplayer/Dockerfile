FROM --platform=linux/arm64 public.ecr.aws/lambda/provided:al2 as builder

FROM --platform=linux/arm64 public.ecr.aws/lambda/provided:al2

COPY lambda-layer /

ARG ARCH

ENV OPENSSL_VERSION="1.1.1u"
ENV PCRE2_VERSION="10.42"
ENV ZLIB_VERSION="1.2.13"
ENV PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
ENV LDFLAGS="-L/usr/local/lib"
RUN if [[ $ARCH == "x86_64" ]]; then \
    yum install -y \
    https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm \
    https://rpms.remirepo.net/enterprise/remi-release-7.rpm \
    yum-utils \
    epel-release \
    msgpack-devel \
    libmcrypt-devel \
    mhash-devel \
    libtidy-devel \
    ; fi \
    && yum install -y \
    unzip \
    curl \
    tar \
    gzip \
    make \
    cmake \
    cmake3 \
    autoconf \
    gcc \
    gcc-c++ \
    vi \
    vim-common \
    which \
    libxslt-devel \
    libjpeg-devel \
    libpng-devel \
    freetype-devel \
    libxml2-devel \
    glibc-devel \
    curl-devel \
    libidn-devel \
    openssl-devel \
    libcurl-devel \
    libpng-devel \
    libjpeg-devel \
    freetype-devel \
    libicu-devel \
    oniguruma-devel \
    libxslt-devel \
    libzstd-devel \
    ImageMagick-devel \
    libmemcached-devel \
    postgresql-devel \
    libedit-devel \
    net-snmp-devel \
    enchant-devel  \
    libffi-devel \
    gmp-devel \
    pam-devel \
    openldap-devel \
    libiodbc-devel \
    postgresql-devel \
    readline-devel \
    net-snmp-devel \
    libzip-devel \
    mysql-devel \
    glibc-static \
    && export CPU_NUM=$(cat /proc/cpuinfo | grep "processor" | wc -l) \
    \
    && cd /tmp \
    && curl -sL https://www.openssl.org/source/openssl-${OPENSSL_VERSION}.tar.gz | tar -xvz > /dev/null \
    && cd openssl-${OPENSSL_VERSION} \
    && if [[ $ARCH == "arm64" ]]; then ./Configure linux-aarch64 --prefix=/tmp/openssl ; fi \
    && if [[ $ARCH == "x86_64" ]]; then ./Configure linux-x86_64 --prefix=/tmp/openssl ; fi \
    && echo '---- Install openssl' \
    && make -j$CPU_NUM \
    && make install \
    \
    && cd /tmp \
    && curl -sL https://github.com/PCRE2Project/pcre2/releases/download/pcre2-${PCRE2_VERSION}/pcre2-${PCRE2_VERSION}.tar.gz | tar -xvz > /dev/null \
    && cd pcre2-${PCRE2_VERSION} \
    && ./configure --prefix=/usr/local \
    && make -j$CPU_NUM \
    && make install \
    \
    && cd /tmp \
    && curl -sL https://zlib.net/zlib-${ZLIB_VERSION}.tar.gz | tar -xvz > /dev/null \
    && cd zlib-${ZLIB_VERSION} \
    && ./configure --prefix=/usr/local \
    && make -j$CPU_NUM \
    && make install \
    \
    && cd /tmp \
    && curl -sL https://download.libsodium.org/libsodium/releases/libsodium-1.0.18.tar.gz | tar -xvz > /dev/null \
    && cd libsodium-1.0.18 \
    && ./configure \
    && make -j$CPU_NUM \
    && make install \
    \
    && cd /tmp \
    && curl -sL https://www.sqlite.org/2023/sqlite-autoconf-3420000.tar.gz | tar -xvz > /dev/null \
    && cd sqlite-autoconf-3420000 \
    && ./configure --prefix=/usr/local \
    && make -j$CPU_NUM \
    && make install \
    \
    && yum install -y openldap-devel \
    && cp -frp /usr/lib64/libldap* /usr/lib/ \
    \
    && yum groupinstall -y "Development Tools" \
    \
    && yum clean all \
    && rm -rf /var/cache/yum

ENV PHP_VERSION="8.2.2"

RUN cd /tmp && \
    curl -O https://www.php.net/distributions/php-$PHP_VERSION.tar.gz && \
    tar -zxf php-$PHP_VERSION.tar.gz && \
    cd php-$PHP_VERSION && \
    git clone https://github.com/phpredis/phpredis.git && \
    mv phpredis ext/redis && \
    ./buildconf --force && \
    ./configure \
    --prefix=/opt/php \
    --with-config-file-path=/opt/php \
    --bindir=/opt/php/bin \
    --sbindir=/opt/php/bin \
    --with-config-file-scan-dir=/opt/php/php.d \
    --localstatedir=/tmp \
    --mandir=/tmp \
    --docdir=/tmp \
    --htmldir=/tmp \
    --dvidir=/tmp \
    --pdfdir=/tmp \
    --psdir=/tmp \
    --enable-shared=yes \
    --enable-cli=shared \
    --enable-fpm=shared \
    --with-fpm-user=nobody \
    --with-fpm-group=nobody \
    --with-bz2=shared \
    --with-pear=shared \
    --enable-ctype=shared \
    --with-curl=shared \
    --enable-dom=shared \
    --enable-exif=shared \
    --enable-fileinfo=shared \
    --enable-filter=shared \
    --enable-gd=shared \
    --with-gettext=shared \
    --with-iconv=shared \
    --enable-mbstring=shared \
    --enable-opcache=shared \
    --with-openssl=shared \
    --enable-pcntl=shared \
    --with-external-pcre=shared \
    --enable-pdo=shared \
    --with-pdo-mysql=shared \
    --enable-mysqlnd=shared \
    --with-pdo-sqlite=shared \
    --with-mysqli=shared \
    --enable-phar=shared \
    --enable-posix=shared \
    --with-readline=shared \
    --enable-session=shared \
    --enable-soap=shared \
    --enable-sockets=shared \
    --enable-sysvsem=shared\
    --enable-sysvshm=shared \
    --enable-tokenizer=shared\
    --with-libxml=shared \
    --enable-simplexml=shared \
    --enable-xml=shared \
    --enable-xmlreader=shared \
    --enable-xmlwriter=shared \
    --with-xsl=shared \
    --enable-ftp=shared \
    --enable-bcmath=shared \
    --with-zip=shared \
    --with-zlib=shared \
    --with-xmlrpc=shared \
    --enable-shmop=shared \
    --with-libedit=shared \
    --enable-calendar=shared \
    --enable-intl=shared \
    --with-pdo-pgsql=shared \
    --with-pgsql=shared \
    --enable-redis=shared \
    && \
    make -j$(cat /proc/cpuinfo | grep "processor" | wc -l) && \
    make install && \
    for bin in $(ls /opt/php/bin); do \
    ln -s /opt/php/bin/$bin /usr/bin ; \
    done && \
    \
    ln -s /opt/nginx/bin/nginx /usr/bin && \
    \
    /lambda-layer change_ext_dir && \
    /lambda-layer php_enable_extensions && \
    \
    yes | pecl install -f igbinary && \
    pecl install -f imagick && \
    pecl install -f libsodium && \
    pecl install -f memcached && \
    \
    cd /tmp && \
    git clone --recursive https://github.com/awslabs/aws-crt-php.git && \
    cd aws-crt-php &&  \
    phpize && \
    ./configure && \
    make -j$(cat /proc/cpuinfo | grep "processor" | wc -l) && \
    make install && \
    \
    /lambda-layer php_enable_extensions && \
    /lambda-layer php_copy_libs && \
    \
    echo 'Clean Cache' && \
    yum clean all && \
    rm -rf /var/cache/yum && \
    rm -rf /tmp/*

# Your builders code here
# You can install or disable some extensions
# RUN pecl install intl
RUN /lambda-layer php_disable shmop \
    calendar \
    xmlrpc \
    sysvsem \
    sysvshm \
    pdo_pgsql \
    pgsql \
    bz2 \
    intl \
    && \
    /lambda-layer php_release

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.0 /lambda-adapter /opt/extensions/
COPY bootstrap /opt

COPY --from=builder      /lib64       /libs/al2
COPY --from=builder      /usr/lib64   /libs/al2
COPY --from=builder      /var/runtime /libs/al2

RUN for lib in $(ls /opt/lib); do \
    if [ -f "/libs/al2/$lib" ]; then \
    echo "rm /opt/lib/$lib because already exists in runtime" ; \
    rm -rf "/opt/lib/$lib" ; \
    fi ; \
    done

RUN cp /usr/local/lib/libsqlite3.so.0 /opt/lib/libsqlite3.so.0 \
    && cp /usr/local/lib/libpcre2-8.so.0 /opt/lib/libpcre2-8.so.0 \
    && find /opt/lib -type f -exec strip -s -g -S -d --strip-debug {} \; \
    && find /opt/php/bin -type f -exec strip -s -g -S -d --strip-debug {} \; \
    && find /opt/php/extensions -type f -exec strip -s -g -S -d --strip-debug {} \; \
    && /lambda-layer php_zip_layer

ENTRYPOINT [ "" ]
