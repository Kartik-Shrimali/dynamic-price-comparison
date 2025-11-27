# 1. VPC (Virtual Private Cloud)
resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags                 = { Name = "PriceComparison-VPC" }
}

# 2. Public Subnet

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[0]
  tags                    = { Name = "PriceComparison-PublicSubnet-1" }
}


resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.2.0/24" # New CIDR block
  map_public_ip_on_launch = true
  # IMPORTANT: Use index [1] to get the second AZ for high availability
  availability_zone = data.aws_availability_zones.available.names[1]
  tags              = { Name = "PriceComparison-PublicSubnet-2" }
}

# 3. Internet Gateway (Allows traffic in and out)
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.app_vpc.id
}

# 4. Route Table (Routes all external traffic to the Internet Gateway)
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.app_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

# 5. Associate Subnet to Route Table
resource "aws_route_table_association" "public_association_1" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

# Associate Subnet 2 with Route Table
resource "aws_route_table_association" "public_association_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_route_table.id
}

# 6. ECS Cluster (Tool 4 - The container host)
# CORRECTED: Typo fixed from aws_ec2_cluster
resource "aws_ecs_cluster" "app_cluster" {
  name = "DevOpsProject-Cluster"
}

# A. New ALB Security Group
resource "aws_security_group" "alb_sg" {
  name        = "price-wise-alb-sg"
  description = "Allow inbound HTTP traffic to ALB"
  vpc_id      = aws_vpc.app_vpc.id 

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"] 
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = { Name = "PriceWise-ALB-SG" }
}

# B. ALB, Target Group, and Listener
resource "aws_lb" "backend_alb" {
  name               = "price-wise-backend-alb"
  internal           = false 
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [
    aws_subnet.public_subnet.id,
    aws_subnet.public_subnet_2.id
  ]
}

resource "aws_lb_target_group" "backend_tg" {
  name     = "price-wise-backend-tg"
  port     = 3000 
  protocol = "HTTP"
  vpc_id   = aws_vpc.app_vpc.id
  target_type = "ip"

  health_check {
    path                = "/health" 
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.backend_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    type             = "forward"
  }
}