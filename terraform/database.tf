# Security Group for RDS: Allows MySQL traffic (port 3306) only from within the VPC
resource "aws_security_group" "rds_sg" {
  vpc_id = aws_vpc.app_vpc.id
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.app_vpc.cidr_block] 
  }
  tags = { Name = "PriceComparison-RDS-SG" }
}

# RDS Subnet Group: Required to run RDS inside the VPC
resource "aws_db_subnet_group" "default" {
  subnet_ids = [
    aws_subnet.public_subnet.id,
    aws_subnet.public_subnet_2.id # Added second subnet
  ]
  tags = { Name = "PriceComparison-RDS-Subnet-Group" }
}

# RDS Instance (MySQL Database)
resource "aws_db_instance" "mysql_db" {
  allocated_storage    = 20
  db_name              = "dbms_project"
  engine               = "mysql"
  instance_class       = "db.t3.micro" 
  username             = "dbadmin"      
  password             = "Mypassword" 
  skip_final_snapshot  = true
  publicly_accessible  = true
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name    = aws_db_subnet_group.default.name
}

# CRITICAL OUTPUT: The address Jenkins and the Node.js container must use
output "rds_endpoint" {
  value = aws_db_instance.mysql_db.address
  description = "The database endpoint URL required for the DB_HOST environment variable."
}