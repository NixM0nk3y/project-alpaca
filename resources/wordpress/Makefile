
export ARTIFACTS_DIR ?= /asset-output

install:
	# install our app deps
	@cd app && /usr/bin/composer install --no-interaction --no-dev
	@./scripts/caddy-install.sh
	@./scripts/supervisord-install.sh
	@./scripts/litestream-install.sh

artifacts:
	@cp -r app $(ARTIFACTS_DIR)/app
	@curl -sf https://api.wordpress.org/secret-key/1.1/salt/ >> $(ARTIFACTS_DIR)/app/config/wp-secrets.php
	@cp -r caddy/* $(ARTIFACTS_DIR)/caddy
	@cp -r supervisor/* $(ARTIFACTS_DIR)/supervisor
	@cp -r litestream/* $(ARTIFACTS_DIR)/litestream
	@cp -r php $(ARTIFACTS_DIR)/php
	@cp -r bootstrap $(ARTIFACTS_DIR)/bootstrap

caddy/format:
	docker run -v $(PWD)/caddy/Caddyfile:/etc/caddy/Caddyfile -it caddy:latest caddy fmt --overwrite /etc/caddy/Caddyfile

build-Function: install artifacts
