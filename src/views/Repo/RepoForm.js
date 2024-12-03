import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
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

  & .message-text {
    white-space: pre-line;
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
  const [error, setError] = useState(null);
  const [state, setState] = useState('enterGitHubUrl'); // State to manage the flow

  const navigate = useNavigate();

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
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Repository cloned successfully. Please provide the repository name.', isUser: false }
        ]);
        setInput(''); // Clear input field after entering GitHub URL
        setState('enterRepoName'); // Update state to ask for repo name
      } catch (err) {
        setError('Error cloning repository');
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Error cloning repository', isUser: false }
        ]);
        setInput(''); // Clear input field on error
      }
    } else if (state === 'enterRepoName') {
      setRepoName(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Repository name "${input}" saved. You can now ask questions.`, isUser: false }
      ]);
      setInput(''); // Clear input field after entering repo name
      setState('askQuestion'); // Transition to askQuestion state
    } else if (state === 'askQuestion') {
      try {
        const response = await axios.post(
          'http://localhost:8000/ask-question/', // Replace with your actual API endpoint
          { repo_name: repoName, question: input },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_API_KEY_HERE',
            },
          }
        );
        const formattedResponse = response.data.answer.replace(/\n/g, '<br />');
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: input, isUser: true }, // User question
          { text: formattedResponse, isUser: false } // API response with formatted newlines
        ]);
        setInput(''); // Clear input field after asking question
      } catch (err) {
        setError('Error asking question');
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Error asking question', isUser: false }
        ]);
        setInput(''); // Clear input field on error
      }
    }
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
        if (yOffset + 10 > pageHeight) {
          doc.addPage();
          yOffset = margin;
        }
        doc.text(line, margin, yOffset);
        yOffset += 10;
      });

      yOffset += 5;
    });

    doc.save('chat_report.pdf');
  };

  return (
    <Container>
      <MainContainer>
        <ChatBox>
          <ChatTitle>Chat Interface</ChatTitle>
          <MessageList>
            {messages.map((msg, index) => (
              <MessageEntry key={index} isUser={msg.isUser}>
                <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.text }} />
              </MessageEntry>
            ))}
          </MessageList>
          <InputContainer>
            <InputField
              type="text"
              placeholder={
                state === 'enterGitHubUrl'
                  ? 'Enter GitHub URL...'
                  : state === 'enterRepoName'
                  ? 'Enter repository name...'
                  : 'Ask your question...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <SendButton onClick={handleSend}>Send</SendButton>
          </InputContainer>
          <ReportButton onClick={generateReport}>Generate Report</ReportButton>
        </ChatBox>
      </MainContainer>
    </Container>
  );
}

export default ChatInterface;
