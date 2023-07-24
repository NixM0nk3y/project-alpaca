import { Construct } from 'constructs';
import { Duration, DockerImage, Stack, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Function, Runtime, Code, LayerVersion, Architecture, Tracing } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

import {
    CorsHttpMethod,
    HttpApi,
    HttpMethod,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export interface AlpacaProps {
    readonly tenant: string;
    readonly environment: string;
    readonly product: string;
}

export class Alpaca extends Construct {
    constructor(scope: Construct, id: string, props?: AlpacaProps) {
        super(scope, id);

        const dataBucket = new Bucket(this, "Bucket", {
            removalPolicy: RemovalPolicy.DESTROY,
        });

        // 👇 layer we've written
        const phpLayer = new LayerVersion(this, 'Layer', {
            compatibleRuntimes: [
                Runtime.PROVIDED_AL2,
            ],
            compatibleArchitectures: [
                Architecture.ARM_64
            ],
            code: Code.fromAsset('./resources/wordpress', {
                bundling: {
                    image: DockerImage.fromBuild("./resources/phplayer", {
                        buildArgs: {
                            "ARCH": "arm64"
                        },
                        platform: "linux/arm64"
                    }),
                    command: ["cp", "/layer.zip", "/asset-output"],
                    environment: {
                    },
                }
            }),
            description: 'php lambda layer',
        });


        // 👇 create our HTTP Api
        const httpApi = new HttpApi(this, 'Api', {
            description: 'HTTP Alpaca API',
            corsPreflight: {
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                ],
                allowMethods: [
                    CorsHttpMethod.OPTIONS,
                    CorsHttpMethod.GET,
                    CorsHttpMethod.POST,
                ],
                allowCredentials: true,
                allowOrigins: ['http://localhost:3000'],
            },
        });

        // 👇 create our lambda function
        const alpacaFunction = new Function(this, 'Lambda', {
            runtime: Runtime.PROVIDED_AL2,
            handler: "bootstrap",
            architecture: Architecture.ARM_64,
            code: Code.fromAsset('./resources/wordpress', {
                bundling: {
                    image: DockerImage.fromBuild("./resources/buildimage"),
                    command: ["make", "build-Function"],
                    environment: {
                        "HOME": "/tmp"
                    },
                }
            }),
            environment: {
                "LOG_LEVEL": "INFO",
                "RUST_LOG": "info",
                "AWS_LAMBDA_EXEC_WRAPPER": "/opt/bootstrap",
                "WP_ENV": 'production',
                "WP_HOME": `https://${httpApi.httpApiId}.execute-api.${Stack.of(this).region}.amazonaws.com`,
                "WP_SITEURL": `https://${httpApi.httpApiId}.execute-api.${Stack.of(this).region}.amazonaws.com/wp`,
                "DB_REPLICA_URL": `s3://${dataBucket.bucketName}/wordpressdata`
            },
            tracing: Tracing.ACTIVE,
            logRetention: RetentionDays.ONE_WEEK,
            layers: [
                phpLayer,
            ],
            memorySize: 512,
            timeout: Duration.seconds(15)
        });

        // add write permissions
        dataBucket.grantReadWrite(alpacaFunction)

        // 👇 add route for GET /
        httpApi.addRoutes({
            path: '/{proxy+}',
            methods: [HttpMethod.GET],
            integration: new HttpLambdaIntegration(
                'GetIntegration',
                alpacaFunction,
            ),
        });

        // 👇 add route for POST /
        httpApi.addRoutes({
            path: '/{proxy+}',
            methods: [HttpMethod.POST],
            integration: new HttpLambdaIntegration(
                'PostIntegration',
                alpacaFunction,
            ),
        });

        // 👇 create an Output
        new CfnOutput(this, 'ApiURI', {
            value: `https://${httpApi.httpApiId}.execute-api.${Stack.of(this).region}.amazonaws.com`,
            description: 'The API we export our stack on',
            exportName: 'AlpacaApiURI',
        });
    }
}