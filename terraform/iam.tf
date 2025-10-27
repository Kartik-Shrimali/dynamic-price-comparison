# 1. ECS Task Execution IAM Role Definition
# This role is assumed by the ECS Fargate service itself
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "devops-price-comparison-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

# 2. Attach AWS Managed Policy (Gives permission to pull ECR images and write logs to CloudWatch)
resource "aws_iam_role_policy_attachment" "ecs_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# CRITICAL STEP: Now update ecs.tf to reference this role.