// STEP F7 - put everything together (same idea as Discord's new App.tsx)
import { useContext } from "react";
import { MicroserviceContext, MicroserviceProvider } from "./context/MicroserviceContext";
import { AuthForm } from "./components/AuthForm";
import { MicroserviceForm } from "./components/MicroserviceForm";
import { MicroserviceList } from "./components/MicroserviceList";
import { Container, Row, LogoutButton, ErrorText } from "./components/styles";

// MainApp is separate from App because a component can't
// useContext a provider that it renders itself
function MainApp() {
  const context = useContext(MicroserviceContext);
  if (!context) throw new Error("MainApp must be used within MicroserviceProvider");
  const { state, dispatch } = context;

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <Container>
      <Row>
        <h1>Microservice and health registry</h1>

        {state.token && (
          <Row>
            {state.user && <span>{state.user.email}</span>}
            <LogoutButton onClick={handleLogout}>Sign Out</LogoutButton>
          </Row>
        )}
      </Row>

      {/* any component can dispatch SET_ERROR -> it shows up here */}
      {state.error && <ErrorText>{state.error}</ErrorText>}

      {/* logged in -> incidents,  logged out -> login form */}
      {state.token ? (
        <>
          <MicroserviceForm />
          <h2>Microservice</h2>
          <MicroserviceList />
        </>
      ) : (
        <AuthForm />
      )}
    </Container>
  );
}

function App() {
  return (
    <MicroserviceProvider>
      <MainApp />
    </MicroserviceProvider>
  );
}

export default App;
