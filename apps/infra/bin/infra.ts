#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { InfraStack } from "../lib/stacks/infra-stack";

const app = new cdk.App();

new InfraStack(app, "InfraStack", {});
