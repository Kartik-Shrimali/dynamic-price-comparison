// Jenkinsfile - FINAL BACKEND DEPLOYMENT SCRIPT
pipeline {
    agent any
    
    environment {
        AWS_REGION = 'ap-south-1'
        BACKEND_REPO_NAME = 'price-comparison-backend'
        AWS_ACCOUNT_ID = '218382887586'
        
        // ECR URL
        BACKEND_ECR_URL = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO_NAME}"
        
        // Credential IDs (Mapped from Jenkins UI)
        AWS_CREDENTIAL_ID = 'aws-devops-user' 
        DB_PASSWORD_ID = 'rds-db-password'
        JWT_SECRET_ID = 'jwt-secret-key'
        
        // RDS Endpoint (Plain Environment Variable)
        DB_HOST_ENDPOINT = "terraform-20251022062415381500000001.c52m80882in5.ap-south-1.rds.amazonaws.com"
        
        // ECS Target details
        ECS_CLUSTER_NAME = 'DevOpsProject-Cluster'
        ECS_TASK_FAMILY = "${BACKEND_REPO_NAME}-task"
        ECS_SERVICE_NAME = "${BACKEND_REPO_NAME}-service"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Build & Push Backend Image') {
            steps {
                withCredentials([aws(credentialsId: AWS_CREDENTIAL_ID, roleBindings: [], roleArn: null, externalId: null)]) {
                    echo "Authenticating to ECR..."
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    
                    // CRITICAL: Executes build from the 'backend' subdirectory
                    dir('backend'){
                        echo "Building backend image..."
                        sh "docker build -t ${BACKEND_REPO_NAME} ."
                        sh "docker tag ${BACKEND_REPO_NAME}:latest ${BACKEND_ECR_URL}:latest"
                        echo "Pushing backend image to ECR..."
                        sh "docker push ${BACKEND_ECR_URL}:latest"
                    }
                }
            }
        }

        stage('Deploy to ECS Fargate') {
            steps {
                withCredentials([aws(credentialsId: AWS_CREDENTIAL_ID, roleBindings: [], roleArn: null, externalId: null)]) {
                    
                    echo "Retrieving and modifying current Task Definition..."
                    sh "aws ecs describe-task-definition --task-definition ${ECS_TASK_FAMILY} --region ${AWS_REGION} > task-definition.json"

                    // CRITICAL FIX: jq command for cleanup and SECURE SECRETS injection
                    sh """
                    cat task-definition.json | jq '.taskDefinition 
                    | del(.taskDefinitionArn) 
                    | del(.revision) 
                    | del(.status) 
                    | del(.requiresAttributes) 
                    | del(.compatibilities) 
                    | del(.registeredAt) 
                    | del(.registeredBy) 
                    | .containerDefinitions[0].image=\"${BACKEND_ECR_URL}:latest\" 
                    | .containerDefinitions[0].environment = [
                        {\"name\":\"DB_HOST\", \"value\":\"${DB_HOST_ENDPOINT}\"},
                        {\"name\":\"DB_USER\", \"value\":\"dbadmin\"} 
                      ]
                    | .containerDefinitions[0].secrets = [
                        {\"name\":\"DB_PASSWORD\", \"valueFrom\":\"arn:aws:ssm:${AWS_REGION}:${AWS_ACCOUNT_ID}:parameter/${DB_PASSWORD_ID}\"},
                        {\"name\":\"JWT_SECRET\", \"valueFrom\":\"arn:aws:ssm:${AWS_REGION}:${AWS_ACCOUNT_ID}:parameter/${JWT_SECRET_ID}\"}
                      ]
                    ' > new-task-definition.json
                    """

                    // Register a new Task Definition Revision
                    sh "aws ecs register-task-definition --cli-input-json file://new-task-definition.json --region ${AWS_REGION} > registered-task.json"

                    // CRITICAL FIX: Use 'script' block to define Groovy variable
                    script {
                        def NEW_TASK_ARN = sh(script: 'jq -r ".taskDefinition.taskDefinitionArn" registered-task.json', returnStdout: true).trim()

                        // Update the ECS Service using the captured Groovy variable
                        sh "aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME} --task-definition ${NEW_TASK_ARN} --force-new-deployment --region ${AWS_REGION}"
                    }
                }
            }
        }
    }
}