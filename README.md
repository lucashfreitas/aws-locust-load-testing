# Intro

Leverage Locust load testing on your own AWS Infrastructure.

It uses docker compose ecs to deploy:

- https://docs.docker.com/cloud/ecs-integration/
- https://docs.docker.com/cloud/ecs-compose-features/
- https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cmd-ecs-cli-compose-parameters.html
- https://docs.docker.com/cloud/ecs-compose-examples/

# Motivation

Load testing is really important to prevent production errors and to see how web services perform given a scenario (number of users/requests).
[Locust](https://locust.io/) is a popular load testing tool used by thousands of users and has a great community/support.

[AWS ECS](https://aws.amazon.com/ecs/) can be easily used to deploy containers in AWS - which is a good fit to deploy multiple workers as Fargate Tasks for Locust.

# Components

The solution has a stack located under `infra` folder which has a [CDK](https://aws.amazon.com/cdk/) stack that creates the ECR repository.

Docker ECS Deploy creates all the resources (Load Balancer, Listeners/Target Groups, ECS Cluster/Fargate Tasks) under the hood. All we need to do is to define the `docker-compose.yaml` file.

`locustfile.py` has a single task that have a simple hello world task. Check [Locust Docs](https://docs.locust.io/en/stable/) to check how you can customize your tests.

# Install

## Requirements

NodeJS, Docker, and a Valid AWS Account.

## Scripts

- `convert`: outputs the cloud formation that will be deployed by AWS ECS
- `up`: Deploy the Application to AWS Infrastructure
- `setup:aws`: Creates a local profile with the AWS details defined in the environment variables
- `create-ecs-context`: Create a new ECS docker context
- `reset-docker-context`: Reset the docker context
- `ecr-push-image`: Push the locust image to ECR
- `set-ecs-context`: Switch docker context to ECS

## Steps

**1. Setup AWS Credentials**

- Access [AWS Console](https://console.aws.amazon.com/console/) and create a new IAM user with ECR permissions and the permissions described here https://docs.docker.com/cloud/ecs-integration/#requirements. 
- Copy the **Access** and **Secret** keys to the environment variables. You also need to copy the Aws Account Id and the region.
- In the root folder run `yarn setup:aws` - this will set up a new aws cli profile `locust` on your local computer.

**2. Deploy CDK Stack with the ECR Repository**

- Navigate to `infra` and run `yarn` or `npm i` to install de dependencies. Run the `deploy` script to deploy the stack.
- Once the stack is deployed copy the `ECR_URI` to the environment variable `AWS_ECR_URI`

**3. Push the docker image to ECR Repository**

- Navigate to the root folder and run `yarn ecr-push-image` to push the Docker Image to ECR. Once it's done replace the `ECR_IMAGE_URI` and `IMAGE_TAG` in `docker-compose.yaml` file with the deployed image details.

**4. Deploy docker-compose to AWS ECS**

- Run `yarn up` or `docker compose up` to deploy the images to AWS ECS. In this step, AWS will create a new stack and all the resources needed (Load Balancer, ECS, etc.)

**5. Accessing Locust UI (master node)**

- Go to AWS Console and check the Load Balancer DNS address and access it using the port 8089 and you will see a web interface that can be used to start your tests.
- You can add as many workers as you want by modifying the `docker-compose.yaml` and adding a new worker. You will see a similar UI to this:

![image](https://user-images.githubusercontent.com/11416392/139055774-2ef8edf6-8b7a-47a7-9755-49644e5357d8.png)


# Removing Resources

- AWS will create two Cloudformation Stacks - one defined by `aws docker-compose ecs` deploy and the other defined by CDK. Remember to remove them once you're done to avoid unexpected costs.
- You can remove the stack created by CDK navigating to `infra` and running `yarn destroy`

# Limitations & Future Improvements

This project was developed as a simple demo to show how it's possible to easily leverage a robust load testing solution in our own cloud environment, but has several limitations and improvements, for example:

- This version uses the default options used by aws ecs compose. If you want to customize it please check the options available [here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cmd-ecs-cli-compose-parameters.html)
- Tag Version is manually defined in `.env` at the moment unless you're using CI/CD that has a unique environment variable identifying the commit id/deploy id or something like this. Whenever you make changes in locust python test files you need to change this environment variable and push the image to ECR again.
- The AWS docker-compose abstracts a lot of resources in the infrastructure (Load Balancer, ECS CPU, memory) - some settings can be changed as described [here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cmd-ecs-cli-compose-parameters.html) but maybe a CDK template that creates the ECS Task/Load Balancer could be used to customize the solution.
- All the commands to set up and deploy could be simpler.
- As future plan, I will create a CDK Template to deploy the infrastructure instead of using ECS docker-compose deploy.

## Feel free to use, modify and ask questions!
