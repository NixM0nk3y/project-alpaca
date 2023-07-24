#/bin/bash
#
#

set -euo pipefail

ARTIFACTS_DIR=${ARTIFACTS_DIR:-"/asset-output"}

GO_VERSION=1.20.6
SUPERVISORD_VERSION=master

export PATH=/usr/local/goenv/shims:/usr/local/goenv/bin:$HOME/go/bin:$PATH

goenv install ${GO_VERSION}
    
eval "$(goenv init -)" \
    && git clone --depth 1 https://github.com/NixM0nk3y/supervisord.git -b ${SUPERVISORD_VERSION} /tmp/supervisord \
    && cd /tmp/supervisord \
    && mkdir -p ${ARTIFACTS_DIR}/supervisor \
    && goenv local ${GO_VERSION} && GOOS=linux GOARCH=arm64 GOARM=7 CGO_ENABLED=0 go build -o ${ARTIFACTS_DIR}/supervisor/supervisord \
