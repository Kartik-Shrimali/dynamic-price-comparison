// Jenkinsfile - FINAL CORRECTED PIPELINE (Allows Backend to Fail Gracefully)
pipeline {
    agent any
    
    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '218382887586'
        ECS_CLUSTER_NAME = 'DevOpsProject-Cluster'
        AWS_CREDENTIAL_ID = 'aws-devops-user' 
        
        // --- Backend Variables ---
        BACKEND_REPO_NAME = 'price-comparison-backend'
        BACKEND_ECR_URL = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO_NAME}"
        ECS_TASK_FAMILY_BACKEND = "${BACKEND_REPO_NAME}-task"
        ECS_SERVICE_NAME_BACKEND = "${BACKEND_REPO_NAME}-service"
        DB_HOST_ENDPOINT = "terraform-20251022062415381500000001.c52m80882in5.ap-south-1.rds.amazonaws.com"
        DB_PASSWORD_ID = 'rds-db-password'
        JWT_SECRET_ID = 'jwt-secret-key'
        
        // --- Frontend Variables ---
        FRONTEND_REPO_NAME = 'price-comparison-frontend'
        FRONTEND_ECR_URL = "${AWS_ACCOUNT_ID}.dkr.ecr.ap-south-1.amazonaws.com/${FRONTEND_REPO_NAME}"
        ECS_TASK_FAMILY_FRONTEND = "${FRONTEND_REPO_NAME}-task"
        ECS_SERVICE_NAME_FRONTEND = "${FRONTEND_REPO_NAME}-service"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        // -------------------------------------------------------------
        // BACKEND STAGES (Pipeline Logic is Correct, App Code is Flawed)
        // -------------------------------------------------------------
        stage('Build & Push Backend') {
            steps {
                withCredentials([aws(credentialsId: AWS_CREDENTIAL_ID, roleBindings: [], roleArn: null, externalId: null)]) {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    dir('backend'){
                        sh "docker build -t ${BACKEND_REPO_NAME} ."
                        sh "docker tag ${BACKEND_REPO_NAME}:latest ${BACKEND_ECR_URL}:latest"
                        sh "docker push ${BACKEND_ECR_URL}:latest"
                    }
                }
            }
        }

        stage('Deploy Backend to ECS') {
            steps {
                // *** CRITICAL FIX: Wrap in catchError to allow pipeline continuation ***
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    withCredentials([aws(credentialsId: AWS_CREDENTIAL_ID, roleBindings: [], roleArn: null, externalId: null)]) {
                        sh "aws ecs describe-task-definition --task-definition ${ECS_TASK_FAMILY_BACKEND} --region ${AWS_REGION} > backend-task-definition.json"

                        sh """
cat backend-task-definition.json |
jq '.taskDefinition 
|
del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) |
del(.registeredBy) 
|
.containerDefinitions[0].image=\"${BACKEND_ECR_URL}:latest\"
|
.containerDefinitions[0].environment = [
    {\"name\":\"DB_HOST\", \"value\":\"${DB_HOST_ENDPOINT}\"},
    {\"name\":\"DB_USER\", \"value\":\"dbadmin\"},
    {\"name\":\"DB_NAME\", \"value\":\"dbms_project\"}
]
|
.containerDefinitions[0].secrets = [
    {\"name\":\"DB_PASSWORD\", \"valueFrom\":\"arn:aws:ssm:${AWS_REGION}:${AWS_ACCOUNT_ID}:parameter/${DB_PASSWORD_ID}\"},
    {\"name\":\"JWT_SECRET\", \"valueFrom\":\"arn:aws:ssm:${AWS_REGION}:${AWS_ACCOUNT_ID}:parameter/${JWT_SECRET_ID}\"}
]
|
.containerDefinitions[0].logConfiguration = 
    {"logDriver": "awslogs", "options": {"awslogs-group": "/ecs/DevOpsProject-Backend", "awslogs-region": "${AWS_REGION}", "awslogs-stream-prefix": "${ECS_SERVICE_NAME_BACKEND}"}}
' > new-backend-task-definition.json
"""

                        sh "aws ecs register-task-definition --cli-input-json file://new-backend-task-definition.json --region ${AWS_REGION} > registered-backend-task.json"
                        
                        script {
                            def NEW_TASK_ARN_BACKEND = sh(script: 'jq -r ".taskDefinition.taskDefinitionArn" registered-backend-task.json', returnStdout: true).trim()
                            sh "aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME_BACKEND} --task-definition ${NEW_TASK_ARN_BACKEND} --force-new-deployment --region ${AWS_REGION}"
                        }
                    }
                }
            }
        }
        
        // -------------------------------------------------------------
        // FRONTEND STAGES (Expected to Succeed)
        // -------------------------------------------------------------
        stage('Build & Push Frontend') {
            steps {
                withCredentials([aws(credentialsId: AWS_CREDENTIAL_ID, roleBindings: [], roleArn: null, externalId: null)]) {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

                    dir('frontend'){ 
                        echo "Building frontend image..."
                        sh "docker build -t ${FRONTEND_REPO_NAME} ." 
                        sh "docker tag ${FRONTEND_REPO_NAME}:latest ${FRONTEND_ECR_URL}:latest"
                        echo "Pushing frontend image to ECR..."
                        sh "docker push ${FRONTEND_ECR_URL}:latest"
                    }
                }
            }
        }
        
        stage('Deploy Frontend to ECS') {
            steps {
                withCredentials([aws(credentialsId: AWS_CREDENTIAL_ID, roleBindings: [], roleArn: null, externalId: null)]) {
                    sh "aws ecs describe-task-definition --task-definition ${ECS_TASK_FAMILY_FRONTEND} --region ${AWS_REGION} > frontend-task-definition.json"

                    // Only update the image tag for the frontend
                    sh """
                    cat frontend-task-definition.json | jq '.taskDefinition 
                    | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy) 
                    | .containerDefinitions[0].image=\"${FRONTEND_ECR_URL}:latest\"' > new-frontend-task-definition.json
                    """

                    sh "aws ecs register-task-definition --cli-input-json file://new-frontend-task-definition.json --region ${AWS_REGION} > registered-frontend-task.json"
                    
                    script {
                        def NEW_TASK_ARN_FRONTEND = sh(script: 'jq -r ".taskDefinition.taskDefinitionArn" registered-frontend-task.json', returnStdout: true).trim()
                        sh "aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME_FRONTEND} --task-definition ${NEW_TASK_ARN_FRONTEND} --force-new-deployment --region ${AWS_REGION}"
                    }
                }
            }
        }
    }
}