#/bin/bash
#
#

set -euo pipefail

ARTIFACTS_DIR=${ARTIFACTS_DIR:-"/asset-output"}

CADDY_VERSION="2.6.4"

mkdir -p ${ARTIFACTS_DIR}/caddy

curl -fSLs https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_arm64.tar.gz -o /tmp/caddy.tar.gz 

tar xfz /tmp/caddy.tar.gz -C ${ARTIFACTS_DIR}/caddy

rm -rf /tmp/caddy.tar.gz ${ARTIFACTS_DIR}/caddy/LICENSE ${ARTIFACTS_DIR}/caddy/README.md