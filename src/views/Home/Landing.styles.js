import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #E7F0DC; /* Light green background for the whole container */
  padding: 20px;
  min-height: 100vh; /* Ensure the container covers the full viewport height */
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  font-size: 2.5em;
  color: #071952; /* Dark blue for the title */
  margin-bottom: 10px;
`;

export const Subtitle = styled.h2`
  font-size: 1.5em;
  color: #071952; /* Dark blue for the subtitle */
`;

export const ButtonContainer = styled.div`
  margin-top: 20px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #071952; /* Dark blue for the button */
  color: #F4CE14; /* Yellow for button text */
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  text-transform: uppercase;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0d2a6b; /* Slightly darker shade on hover */
  }
`;

export const Image = styled.img`
  margin-top: 30px;
  width: 300px;
  height: auto;
  max-width: 100%; /* Ensure responsiveness */
`;

export const Section = styled.section`
  width: 100%;
  max-width: 800px;
  margin: 20px 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const SectionTitle = styled.h3`
  font-size: 2em;
  color: #071952; /* Dark blue for section titles */
  margin-bottom: 10px;
`;

export const SectionContent = styled.div`
  font-size: 1.2em;
  color: #333;

  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 10px 0;
    }
  }
`;

export const Footer = styled.footer`
  margin-top: 20px;
  padding: 10px 0;
  background-color: #071952; /* Dark blue for the footer */
  color: #F4CE14; /* Yellow for footer text */
  text-align: center;
  width: 100%;
`;

export const FooterText = styled.p`
  margin: 0;
`;
