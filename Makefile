# Meta tasks
# ----------

# Useful variables
export SAM_CLI_TELEMETRY ?= 0

# deployment environment
export ENVIRONMENT ?= production

# region
export AWS_REGION ?= eu-west-1

#
export AWS_ACCOUNT ?= 074705540277

export CODEBUILD_BUILD_NUMBER ?= 0
export CODEBUILD_RESOLVED_SOURCE_VERSION ?=$(shell git rev-list -1 HEAD --abbrev-commit)
export DATE=$(shell date -u '+%Y%m%d')

# Output helpers
# --------------

TASK_DONE = echo "✓  $@ done"
TASK_BUILD = echo "🛠️  $@ done"

# ----------------

.DEFAULT_GOAL := build

clean:
	@rm -rf cdk.out .aws-sam application
	@git clean -fdx
	@$(TASK_DONE)

test:
	go test -v -p 1 ./...
	@$(TASK_BUILD)

bootstrap:
	CDK_NEW_BOOTSTRAP=1 cdk bootstrap aws://$(AWS_ACCOUNT)/$(AWS_REGION) --require-approval never --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess --show-template
	@$(TASK_BUILD)

diff: diff/application
	@$(TASK_DONE)

synth: synth/application
	@$(TASK_DONE)

deploy: deploy/application
	@$(TASK_DONE)

apply: deploy/application
	@$(TASK_DONE)

destroy: destroy/application
	@$(TASK_DONE)

synth/application: build
	cdk synth
	@$(TASK_BUILD)

diff/application: build
	cdk diff
	@$(TASK_BUILD)

deploy/application: build
	cdk deploy
	@$(TASK_BUILD)

destroy/application: build
	cdk destroy
	@$(TASK_BUILD)

ci/deploy/application: build
	cdk deploy --ci true --require-approval never 
	@$(TASK_BUILD)

test/hello:
	@sam local invoke "alpaca-function" --env-vars ./test/environment.json --event ./test/events/hello.json -t ./cdk.out/ProjectAlpacaStack.template.json

test/api:
	@sam local start-api --env-vars ./test/environment.json -t ./cdk.out/ProjectAlpacaStack.template.json

build: init
	@$(TASK_DONE)

init: 
	npm install
	@$(TASK_DONE)