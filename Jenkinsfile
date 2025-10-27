// Jenkinsfile - Backend Service (price-comparison-backend)
pipeline {
    agent any
    
    environment {
        AWS_REGION = 'ap-south-1'
        BACKEND_REPO_NAME = 'price-comparison-backend'
        AWS_ACCOUNT_ID = '218382887586'
        
        // ECR URL pulled from your summary
        BACKEND_ECR_URL = "218382887586.dkr.ecr.ap-south-1.amazonaws.com/price-comparison-backend"
        
        // Credential IDs set in Jenkins UI
        AWS_CREDENTIAL_ID = 'aws-devops-user' 
        DB_PASSWORD_ID = 'rds-db-password'
        JWT_SECRET_ID = 'jwt-secret-key'
        
        // RDS Endpoint from your summary
        DB_HOST_ENDPOINT = "terraform-20251022062415381500000001.c52m80882in5.ap-south-1.rds.amazonaws.com"
        
        // ECS Target details
        ECS_CLUSTER_NAME = 'DevOpsProject-Cluster'
        ECS_TASK_FAMILY = "${BACKEND_REPO_NAME}-task"
        ECS_SERVICE_NAME = "${BACKEND_REPO_NAME}-service"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Assuming the backend code is in the repository root
                checkout scm
            }
        }
        
        stage('Build & Push Backend Image') {
            steps {
                // Use the AWS Credentials to get the ECR login token
                withCredentials([aws(credentialsId: AWS_CREDENTIAL_ID, roleBindings: [], roleArn: null, externalId: null)]) {
                    // 1. Authenticate Docker to ECR (CRITICAL STEP)
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${BACKEND_ECR_URL}"
                    
                    // 2. Build the Docker image
                    dir('backend'){

                        sh "docker build -t ${BACKEND_REPO_NAME} ."

                        // 3. Tag and Push to ECR
                        sh "docker tag ${BACKEND_REPO_NAME}:latest ${BACKEND_ECR_URL}:latest"
                        sh "docker push ${BACKEND_ECR_URL}:latest"
                    }
                }
            }
        }

        stage('Deploy to ECS Fargate') {
            steps {
                // Use the AWS Credentials for ECS API calls
                withCredentials([aws(credentialsId: AWS_CREDENTIAL_ID, roleBindings: [], roleArn: null, externalId: null)]) {
                    
                    // First, retrieve the current Task Definition to modify it
                    sh "aws ecs describe-task-definition --task-definition ${ECS_TASK_FAMILY} --region ${AWS_REGION} > task-definition.json"

                    // Use jq (or sed/awk if jq isn't available) to inject environment variables and new image tag
                    // NOTE: This assumes your container name in the Task Definition is the same as the repo name.
                    sh "cat task-definition.json | jq '.taskDefinition | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | .containerDefinitions[0].image=\"${BACKEND_ECR_URL}:latest\" | .containerDefinitions[0].environment = [{\"name\":\"DB_HOST\", \"value\":\"${DB_HOST_ENDPOINT}\"}, {\"name\":\"DB_PASSWORD\", \"valueFrom\":\"${DB_PASSWORD_ID}\"}, {\"name\":\"JWT_SECRET\", \"valueFrom\":\"${JWT_SECRET_ID}\"}]' > new-task-definition.json"

                    // Register a new Task Definition Revision
                    sh "aws ecs register-task-definition --cli-input-json file://new-task-definition.json --region ${AWS_REGION} > registered-task.json"

                    // Get the new Revision ARN to pass to the service update
                    sh 'NEW_TASK_ARN=$(jq -r ".taskDefinition.taskDefinitionArn" registered-task.json)'

                    // Update the ECS Service to use the new Task Definition and restart the containers
                    sh "aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME} --task-definition \$(NEW_TASK_ARN) --force-new-deployment --region ${AWS_REGION}"
                }
            }
        }
    }
}