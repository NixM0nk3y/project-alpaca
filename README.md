# Welcome project Alpaca

Run a wordpress installation from a single lambda process. The software stack should be functional but considered to be proof-of-concept to explore various elements of tech rather than a recommended hosting pattern.

## Architecture

The lambda uses the [AWS Lambda Adaptor](https://github.com/awslabs/aws-lambda-web-adapter) to bridge AWS event driven gateway onto a more traditional HTTP stack. In this case the stack is a Caddy , PHP and Wordpress install. 

Wordpress data storage is backed by SQLite which is replicated into S3 storage via [litestream](https://litestream.io/). Previous state is restored to the lambda on cold-start. Concurrent access to the datastore by multiple lambdas is conveniently ignored and likely to be unstable.

*NOTE:* the stack uses a `arm64`` architecture and will require docker builds of the supporting lambda software. This will require a reasonable amount of [cross-architecture docker builds](https://www.docker.com/blog/multi-arch-images/) ( we require php with modern SQLite support ).

![diagram](_media/Architecture.png ':size=25%')

## Useful commands

* `make clean`      remove any intermediate state
* `make diff`       compare deployed stack with current state
* `make deploy `    deploy this stack to your default AWS account/region
