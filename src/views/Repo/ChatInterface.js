import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
`;

const TopNav = styled.div`
  background-color: #071952;
  color: #F4CE14;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #071952;
  color: #F4CE14;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const MainContainer = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
`;

const ChatBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 800px;
`;

const ChatTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: #071952;
  font-size: 20px;
`;

const MessageList = styled.div`
  flex: 1;
  // overflow-y: auto;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
`;

const MessageEntry = styled.div`
  background-color: ${(props) => (props.isUser ? '#071952' : '#E7F0DC')};
  color: ${(props) => (props.isUser ? '#F4CE14' : '#333')};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  // max-width: 99%;
  word-break: break-word;
  text-align: ${(props) => (props.isUser ? 'right' : 'left')};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: 10px solid transparent;
    border-left: ${(props) => (props.isUser ? '10px solid #071952' : 'none')};
    border-right: ${(props) => (props.isUser ? 'none' : '10px solid #E7F0DC')};
    left: ${(props) => (props.isUser ? 'auto' : '-10px')};
    right: ${(props) => (props.isUser ? '-10px' : 'auto')};
  }

  p {
    margin: 0;
    margin-bottom: 5px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  border-top: 1px solid #ddd;
  padding-top: 10px;
  background-color: #f9f9f9;
`;

const InputField = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  margin-right: 10px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #071952;
    outline: none;
  }
`;

const ReportButton = styled.button`
  padding: 10px 20px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [repoName, setRepoName] = useState('');
  const [state, setState] = useState('enterGitHubUrl');

  const navigate = useNavigate();

  const predefinedQuestions = [
    "Explain about project",
    "What is the purpose of the UserManagementService repository?",
    "What are the technologies of this Project",
    "Explain about setup process",
    "What is the purpose of the DTO classes in this UserManagementService project?",
    "What is the purpose of the Kubernetes configuration file for the user-management-ms application"
  ];

  useEffect(() => {
    if (state === 'waitingForAnswers') {
      sendPredefinedQuestions();
    }
  }, [state]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    if (state === 'enterGitHubUrl') {
      try {
        const response = await axios.post(
          'http://localhost:8000/clone-repo/',
          { github_url: input },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_API_KEY_HERE',
            },
          }
        );

        if (response.data.message === 'Repository cloned and files indexed successfully.') {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: 'Repository cloned successfully. Please provide the repository name.', isUser: false }
          ]);
          setState('enterRepoName');
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: 'Error cloning repository.', isUser: false }
          ]);
        }
      } catch (err) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Error cloning repository.', isUser: false }
        ]);
      }

      setInput('');
    } else if (state === 'enterRepoName') {
      setRepoName(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Repository name "${input}" saved. System will generate questions and provide pdf.`, isUser: false }
      ]);
      setInput('');

      setState('waitingForAnswers');
    }
  };

  const sendPredefinedQuestions = async () => {
    for (let question of predefinedQuestions) {
      try {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Q: ${question}`, isUser: true }
        ]);

        const response = await axios.post(
          'http://localhost:8000/ask-question/',
          { repo_name: repoName, question },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_API_KEY_HERE',
            },
          }
        );

        const answerLines = response.data.answer.split('\n');
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: answerLines.join('\n'), isUser: false }
        ]);
      } catch (err) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Error retrieving answer', isUser: false }
        ]);
      }
    }

    setState('questionsAsked');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(18);
    doc.text('Chat Report', margin, 20);
    doc.setLineWidth(0.5);
    doc.line(margin, 25, 200 - margin, 25);

    doc.setFontSize(12);
    let yOffset = 30;

    messages.forEach((msg, index) => {
      const title = msg.isUser ? 'User:' : 'API:';
      const text = `${title} ${msg.text}`;
      const textLines = doc.splitTextToSize(text, 180 - 2 * margin);

      textLines.forEach(line => {
        if (yOffset + 10 > pageHeight - margin) {
          doc.addPage();
          yOffset = margin;
        }
        doc.text(line, margin, yOffset);
        yOffset += 10;
      });
    });

    doc.save('chat_report.pdf');
  };

  return (
    <Container>
      <MainContainer>
        <ChatBox>
          <ChatTitle>Chat</ChatTitle>
          <MessageList>
            {messages.map((msg, index) => (
              <MessageEntry key={index} isUser={msg.isUser}>
                {msg.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </MessageEntry>
            ))}
          </MessageList>
          <InputContainer>
            <InputField
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="First Enter Repo Url..."
            />
            <SendButton onClick={handleSend}>Send</SendButton>
          </InputContainer>
          {state === 'questionsAsked' && (
            <ReportButton onClick={generateReport}>Generate Report</ReportButton>
          )}
        </ChatBox>
      </MainContainer>
    </Container>
  );
}

export default ChatInterface;
