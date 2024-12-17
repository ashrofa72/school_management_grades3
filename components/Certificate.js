import React, { useState } from 'react';
import styled from 'styled-components';

const Certificate = () => {
  const [studentData, setStudentData] = useState({
    name: '',
    class: '',
    marks: {
      arabic: {
        exam1: '',
        exam2: '',
        exam3: '',
        total: '',
        percentage: '',
      },
      // ... other subjects
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission (e.g., save to database, print)
    console.log(studentData);
  };

  return (
    <Container>
      <Title>Student Report Card</Title>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <Label>Student Name:</Label>
          <Input
            type="text"
            name="name"
            value={studentData.name}
            onChange={handleChange}
          />
        </InputContainer>
        {/* ... other input fields for student details and marks */}
        <Button type="submit">Generate Certificate</Button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default Certificate;
