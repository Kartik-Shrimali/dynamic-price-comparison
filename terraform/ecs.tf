# 1. ECR Repositories (Image storage for Jenkins push)
resource "aws_ecr_repository" "backend_repo" { name = "price-comparison-backend" }
resource "aws_ecr_repository" "frontend_repo" { name = "price-comparison-frontend" }

output "backend_ecr_url" { value = aws_ecr_repository.backend_repo.repository_url }
output "frontend_ecr_url" { value = aws_ecr_repository.frontend_repo.repository_url }

# 2. Backend API Task Definition
resource "aws_ecs_task_definition" "backend_task" {
  family = "price-comparison-backend-task"
  # CORRECTED: Typo fixed from network_node
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "backend-api-container"
      image = aws_ecr_repository.backend_repo.repository_url
      # CORRECTED: Port changed to 3000 to match your Node.js app
      portMappings = [{ containerPort = 3000, hostPort = 3000, protocol = "tcp" }]
      environment = [
        # Injects the RDS address created in database.tf
        { name = "DB_HOST", value = aws_db_instance.mysql_db.address },
        { name = "DB_USER", value = "dbadmin" },
        { name = "DB_NAME", value = "dbms_project" }
      ]
    }
  ])
}

# 3. Frontend Web Task Definition
resource "aws_ecs_task_definition" "frontend_task" {
  family = "price-comparison-frontend-task"
  # CORRECTED: Typo fixed from network_node
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    { name  = "frontend-web-container"
      image = aws_ecr_repository.frontend_repo.repository_url
    portMappings = [{ containerPort = 80, hostPort = 80, protocol = "tcp" }] }
  ])
}

# Define the EXISTING Backend Task Security Group
resource "aws_security_group" "price_comparison_backend_sg" {
  # MATCHES EXISTING AWS NAME
  name        = "PriceComparison-ECS-Backend-SG" 
  # MATCHES EXISTING AWS DESCRIPTION
  description = "Allows traffic for the Node/Express Backend Service." 
  vpc_id      = aws_vpc.app_vpc.id

  # CRITICAL ADDITION: Allow ALB to talk to Backend Tasks on Port 3000
  ingress {
    protocol        = "tcp"
    from_port       = 3000
    to_port         = 3000
    security_groups = [aws_security_group.alb_sg.id] 
    description     = "Allow ALB to talk to Backend Tasks on 3000"
  }
  
  # The original ingress/egress rules are implicitly handled by Terraform and the explicit rules above.
  # We only include the egress block here to handle the global Egress.
  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # CORRECTED TAG NAME
  tags = { Name = "PriceComparison-ECS-Backend-SG" } 
}


# Define the EXISTING Frontend Task Security Group
resource "aws_security_group" "price_comparison_frontend_sg" {
  # MATCHES EXISTING AWS NAME
  name        = "PriceComparison-ECS-Frontend-SG" 
  # MATCHES EXISTING AWS DESCRIPTION
  description = "Allows inbound public access (HTTP Port 80) to the Price Comparison Frontend ECS Fargate tasks"
  vpc_id      = aws_vpc.app_vpc.id

  # Ingress: Allow public HTTP traffic on port 80 (Should already be there)
  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"] 
    description = "Allow HTTP access to Frontend Tasks"
  }

  # Egress: Allows tasks to reach the internet (for the backend API calls)
  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # CORRECTED TAG NAME
  tags = { Name = "PriceComparison-ECS-Frontend-SG" }
}

# ECS Service for the Backend API (CRITICAL: Links to the ALB Target Group)
resource "aws_ecs_service" "price_comparison_backend_service" {
  name            = "price-comparison-backend-service"
  cluster         = aws_ecs_cluster.app_cluster.name
  task_definition = aws_ecs_task_definition.backend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  wait_for_steady_state = true

  network_configuration {
    security_groups  = [aws_security_group.price_comparison_backend_sg.id]
    subnets          = [aws_subnet.public_subnet.id, aws_subnet.public_subnet_2.id]
    assign_public_ip = true
  }

  # --- CRITICAL: Links the service tasks to the ALB Target Group ---
  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "backend-api-container" 
    container_port   = 3000 
  }
}

# ECS Service for the Frontend Web (No Load Balancer for this service yet)
resource "aws_ecs_service" "price_comparison_frontend_service" {
  name            = "price-comparison-frontend-service"
  cluster         = aws_ecs_cluster.app_cluster.name
  task_definition = aws_ecs_task_definition.frontend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  wait_for_steady_state = true # Ensures health checks pass before completion

  network_configuration {
    security_groups  = [aws_security_group.price_comparison_frontend_sg.id] # Reference the correct Frontend SG
    subnets          = [aws_subnet.public_subnet.id, aws_subnet.public_subnet_2.id]
    assign_public_ip = true
  }
}