import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  Title,
  Subtitle,
  ButtonContainer,
  Button,
  Image,
  Section,
  SectionTitle,
  SectionContent,
} from './Landing.styles';

function Landing() {
  return (
    <Container>
      <Header>
        <Title>Welcome to Repository Assistance Tool</Title>
        <Subtitle>Your assistant for programming in English</Subtitle>
        <ButtonContainer>
          <Link to="/repo-assistance">
            <Button>Get Started</Button>
          </Link>
        </ButtonContainer>
        <Image src="src/assets/images/avatars/image1.jpg" alt="Programming Illustration" />
      </Header>
      <Section>
        <SectionTitle>Why Choose Us?</SectionTitle>
        <SectionContent>
          <p>We provide the best tools and repository assistance facility for developers.</p>
        </SectionContent>
      </Section>
      <Section>
        <SectionTitle>Features</SectionTitle>
        <SectionContent>
          <ul>
            <li>Generate Reports</li>
            <li>Repository Assistance</li>
          </ul>
        </SectionContent>
      </Section>
    </Container>
  );
}

export default Landing;
