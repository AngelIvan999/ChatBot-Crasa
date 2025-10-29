import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

export default function Login() {
  const { loginDirecto, loading } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginDirecto(formData.email, formData.password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <Container>
      <LoginCard>
        <LogoSection>
          <h1>🤖 Crasa ChatBot</h1>
          <p>Sistema de Gestión de Conversaciones</p>
        </LogoSection>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "INGRESANDO..." : "INGRESAR"}
          </SubmitButton>
        </form>

        <Footer>
          <p>CRASA REPRESENTACIONES S.A - RUC: 20100047218</p>
          <p>© 2025 crasa.com - Todos los derechos reservados</p>
        </Footer>
      </LoginCard>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #00a884 0%, #0f172a 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 32px;
    color: #111827;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
    font-size: 14px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #374151;
    font-weight: 600;
    font-size: 14px;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #00a884;
      box-shadow: 0 0 0 3px rgba(0, 168, 132, 0.1);
    }

    &:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #00a884;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #008c6f;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 168, 132, 0.3);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const Footer = styled.div`
  margin-top: 32px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;

  p {
    color: #6b7280;
    font-size: 12px;
    margin: 4px 0;
  }
`;
