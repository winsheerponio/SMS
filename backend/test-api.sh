#!/bin/bash

# Test script for Student Management System API
# This script tests all CRUD operations

echo "======================================"
echo "Student Management System API Tests"
echo "======================================"
echo ""

BASE_URL="http://localhost:4000/api/students"

# Test 1: Get all students (should be empty initially)
echo "Test 1: GET all students"
curl -s $BASE_URL | jq '.'
echo -e "\n"

# Test 2: Create first student
echo "Test 2: POST - Create first student (Alice Johnson)"
ALICE_RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024001",
    "fullName": "Alice Johnson",
    "email": "alice.johnson@gmail.com",
    "gender": "Female",
    "yearLevel": 1,
    "program": "Computer Science",
    "university": "MIT"
  }')
echo $ALICE_RESPONSE | jq '.'
ALICE_ID=$(echo $ALICE_RESPONSE | jq -r '.data.id')
echo -e "\n"

# Test 3: Create second student
echo "Test 3: POST - Create second student (Bob Smith)"
BOB_RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024002",
    "fullName": "Bob Smith",
    "email": "bob.smith@gmail.com",
    "gender": "Male",
    "yearLevel": 2,
    "program": "Engineering",
    "university": "Stanford"
  }')
echo $BOB_RESPONSE | jq '.'
BOB_ID=$(echo $BOB_RESPONSE | jq -r '.data.id')
echo -e "\n"

# Test 4: Create third student
echo "Test 4: POST - Create third student (Charlie Davis)"
CHARLIE_RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024003",
    "fullName": "Charlie Davis",
    "email": "charlie.davis@gmail.com",
    "gender": "Other",
    "yearLevel": 3,
    "program": "Data Science",
    "university": "Harvard"
  }')
echo $CHARLIE_RESPONSE | jq '.'
CHARLIE_ID=$(echo $CHARLIE_RESPONSE | jq -r '.data.id')
echo -e "\n"

# Test 5: Get all students (should show 3 students)
echo "Test 5: GET all students (should show 3 students)"
curl -s $BASE_URL | jq '.'
echo -e "\n"

# Test 6: Get student by ID
echo "Test 6: GET student by ID (Alice)"
curl -s $BASE_URL/$ALICE_ID | jq '.'
echo -e "\n"

# Test 7: Update student
echo "Test 7: PUT - Update student (Alice moves to year 2)"
curl -s -X PUT $BASE_URL/$ALICE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024001",
    "fullName": "Alice Johnson",
    "email": "alice.johnson@gmail.com",
    "gender": "Female",
    "yearLevel": 2,
    "program": "Computer Science",
    "university": "MIT"
  }' | jq '.'
echo -e "\n"

# Test 8: Try to create duplicate student ID (should fail)
echo "Test 8: POST - Try to create duplicate student ID (should fail)"
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024001",
    "fullName": "Duplicate Person",
    "email": "duplicate@gmail.com",
    "gender": "Male",
    "yearLevel": 1,
    "program": "Business",
    "university": "Yale"
  }' | jq '.'
echo -e "\n"

# Test 9: Delete a student
echo "Test 9: DELETE student (Charlie)"
curl -s -X DELETE $BASE_URL/$CHARLIE_ID | jq '.'
echo -e "\n"

# Test 10: Get all students (should show 2 students)
echo "Test 10: GET all students (should show 2 students after deletion)"
curl -s $BASE_URL | jq '.'
echo -e "\n"

echo "======================================"
echo "All tests completed!"
echo "======================================"
