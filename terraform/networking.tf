# 1. VPC (Virtual Private Cloud)
resource "aws_vpc" "app_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = { Name = "PriceComparison-VPC" }
}

# 2. Public Subnet

  resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true 
  availability_zone       = data.aws_availability_zones.available.names[0]
  tags = { Name = "PriceComparison-PublicSubnet-1" }
  }


 resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.2.0/24" # New CIDR block
  map_public_ip_on_launch = true 
  # IMPORTANT: Use index [1] to get the second AZ for high availability
  availability_zone       = data.aws_availability_zones.available.names[1] 
  tags = { Name = "PriceComparison-PublicSubnet-2" }
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