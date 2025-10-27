# 1. ECR Repositories (Image storage for Jenkins push)
resource "aws_ecr_repository" "backend_repo" { name = "price-comparison-backend" }
resource "aws_ecr_repository" "frontend_repo" { name = "price-comparison-frontend" }

output "backend_ecr_url" { value = aws_ecr_repository.backend_repo.repository_url }
output "frontend_ecr_url" { value = aws_ecr_repository.frontend_repo.repository_url }

# 2. Backend API Task Definition
resource "aws_ecs_task_definition" "backend_task" {
    family = "price-comparison-backend-task"
    # CORRECTED: Typo fixed from network_node
    network_mode = "awsvpc" 
    requires_compatibilities = ["FARGATE"]
    cpu = "256" 
    memory = "512" 
    
    execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

    container_definitions = jsonencode([
        {
            name = "backend-api-container"
            image = aws_ecr_repository.backend_repo.repository_url
            # CORRECTED: Port changed to 3000 to match your Node.js app
            portMappings = [{containerPort = 3000 , hostPort = 3000 , protocol = "tcp"}] 
            environment = [
                # Injects the RDS address created in database.tf
                {name = "DB_HOST" , value = aws_db_instance.mysql_db.address},
                {name = "DB_USER" , value = "dbadmin"},
                {name = "DB_NAME" , value = "dbms_project"}
            ]
        }
    ])
}

# 3. Frontend Web Task Definition
resource "aws_ecs_task_definition" "frontend_task" {
    family = "price-comparison-frontend-task"
    # CORRECTED: Typo fixed from network_node
    network_mode = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu = "256"
    memory = "512"

    execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

    container_definitions = jsonencode([
        {name = "frontend-web-container"
        image = aws_ecr_repository.frontend_repo.repository_url
        portMappings = [{containerPort = 80 , hostPort = 80 , protocol = "tcp"}]}
    ])
}