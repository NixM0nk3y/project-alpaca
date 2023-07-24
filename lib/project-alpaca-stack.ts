import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Alpaca } from './alpaca-api';


export interface AlpacaStackProps extends cdk.StackProps {
    readonly tenant: string;
    readonly environment: string;
    readonly product: string;
}

export class ProjectAlpacaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: AlpacaStackProps) {
        super(scope, id, props);

        new Alpaca(this, 'Alpaca', props);

    }
}
