// STEP F4 - list (GET)  +  STEP F6 - update / delete
// same idea as Discord's PieList
import { useContext, useEffect } from "react";
import { MicroserviceContext } from "../context/MicroserviceContext";
import { fetchMicroservice, updateMicroservice, deleteMicroservice } from "../api/serviceService";
import { type Environment, ServiceStatus, type Microservice } from "../types";
import { Grid, Card, Row, Select, DeleteButton } from "./styles";

export const MicroserviceList: React.FC = () => {
  const context = useContext(MicroserviceContext);
  if (!context) throw new Error("MicroserviceList must be used within MicroserviceProvider");
  const { state, dispatch } = context;

  // STEP F4: load the incidents when the list shows up
  useEffect(() => {
    const loadMicroservice = async () => {
      dispatch({ type: "FETCH_START" });

      try {
        const data = await fetchMicroservice(state.token);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
      }
    };

    loadMicroservice();
  }, [dispatch, state.token]);

  // STEP F6: change status or severity
  const handleUpdate = async (id: string, changes: Partial<Incident>) => {
    try {
      const updated = await updateMicroservice(state.token, id, changes);
      dispatch({ type: "UPDATE_SUCCESS", payload: updated });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
    }
  };

  // STEP F6: delete
  const handleDelete = async (id: string) => {
    try {
      await deleteMicroservice(state.token, id);
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
    }
  };

  if (state.loading) return <p>Loading incidents...</p>;

  if (state.services.length === 0) return <p>No incidents yet.</p>;

  return (
    <Grid>
      {state.incidents.map((incident) => (
        <Card key={incident.id}>
          <h4>{incident.title}</h4>
          <p>{incident.description}</p>

          <Row>
            <span>Status</span>
            <Select
              value={incident.severity}
              onChange={(e) => handleUpdate(incident.id, { severity: e.target.value })}
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Row>

          <Row>
            <span>Status</span>
            <Select
              value={incident.status}
              onChange={(e) => handleUpdate(incident.id, { status: e.target.value })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Row>

          <DeleteButton onClick={() => handleDelete(incident.id)}>Delete</DeleteButton>
        </Card>
      ))}
    </Grid>
  );
};
