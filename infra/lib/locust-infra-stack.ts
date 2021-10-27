import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";
import { TagMutability } from "@aws-cdk/aws-ecr";
import { CfnOutput } from "@aws-cdk/core";
export class LocustInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const locustImageRepository = new ecr.Repository(this, "LocustRepository", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      repositoryName: "locust-repository",
      imageTagMutability: TagMutability.IMMUTABLE,
    });

    new CfnOutput(this, "LocustImageUri", {
      value: locustImageRepository.repositoryUri,
    });
  }
}
