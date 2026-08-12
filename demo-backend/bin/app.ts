#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DataStack } from '../lib/data-stack';
import { ApiStack } from '../lib/api-stack';
// The demo frontend is the landing page at /demo (src/pages/Demo.jsx, deployed
// by Vercel); these stacks are only the AWS backend it talks to.

const app = new cdk.App();
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const data = new DataStack(app, 'DemoDataStack', { env });
new ApiStack(app, 'DemoApiStack', { env, table: data.table });

app.synth();
