FROM public.ecr.aws/sam/build-provided.al2:latest

#--platform=linux/arm64

COPY install-composer.sh /tmp
COPY install-go.sh /tmp

RUN yum install -y amazon-linux-extras \
    && amazon-linux-extras enable php8.2 \
    && yum install -y php \
    && /tmp/install-composer.sh \
    && rm /tmp/install-composer.sh \
    && /tmp/install-go.sh \
    && rm /tmp/install-go.sh

ENV PATH=/root/.goenv/shims:/root/.goenv/bin:/root/go/bin:/var/lang/bin:/usr/local/bin:/usr/bin/:/bin:/opt/bin:/usr/local/opt/sam-cli/bin
