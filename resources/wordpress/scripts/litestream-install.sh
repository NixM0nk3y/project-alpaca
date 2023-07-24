#/bin/bash
#
#

#set -x
set -euo pipefail

ARTIFACTS_DIR=${ARTIFACTS_DIR:-"/asset-output"}

LITESTREAM_VERSION=0.3.9

mkdir -p ${ARTIFACTS_DIR}/litestream

# Download the static build of Litestream directly into the path & make it executable.
curl -fSLs https://github.com/benbjohnson/litestream/releases/download/v${LITESTREAM_VERSION}/litestream-v${LITESTREAM_VERSION}-linux-arm64-static.tar.gz -o /tmp/litestream.tar.gz

tar -C ${ARTIFACTS_DIR}/litestream -xzf /tmp/litestream.tar.gz; \
    rm /tmp/litestream.tar.gz
