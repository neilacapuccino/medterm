// STEP F5 - create form -> dispatch CREATE_SUCCESS
import { useContext, useState } from "react";
import { MicroserviceContext } from "../context/MicroserviceContext";
import { createMicroservice } from "../api/serviceService";
import { Form, Input, TextArea, Select, Button } from "./styles";

export const MicroserviceForm: React.FC = () => {
  const context = useContext(MicroserviceContext);
  if (!context) throw new Error("MicroserviceForm must be used within MicroserviceProvider");
  const { state, dispatch } = context;

  const [user, setUser] = useState("");
  const [environment, setEnvironment] = useState("");
  const [status, setStatus] = useState("low");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newMicroservice = await createMicroservice(state.token, { user, environment, status });

      dispatch({ type: "CREATE_SERVICE_SUCCESS", payload: newMicroservice });

      // clear the form
      setUser("");
      setEnvironment("");
      setStatus("HEALTHY");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Report an service</h3>

      <Input
        placeholder="User"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        required
      />
      <TextArea
        placeholder="Environment"
        value={environment}
        onChange={(e) => setEnvironment(e.target.value)}
        required
      />

      <Select value={status} onChange={(e) => setStatus(e.target.value)}>
        {status.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>

      <Button type="submit">Submit ticket</Button>
    </Form>
  );
};
