import { useState, useEffect } from 'react';
import './App.css';
import DataTable from './components/DataTable';
import ShiftModal from './components/ShiftModal';
import Button from "@mui/material/Button";

function App() {
  const [nurses, setNurses] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const fetchNurses = async () => {
      const response = await fetch('/nurses');
      const data = await response.json();
      if (response.status !== 200) {
        fetchNurses();
      } else {
        setNurses(data);
      }
    };
    
    const fetchShifts = async () => {
      const response = await fetch('/shifts');
      const data = await response.json();
      if (response.status !== 200) {
        fetchShifts();
      } else {
        setShifts(data);
      }
    };
    fetchNurses();
    fetchShifts();
  }, []);

  return (
    <div className="App">
      <Button variant="outlined" onClick={handleOpen}>Set Shift Assignment</Button>
      <ShiftModal
        nurses={nurses}
        shifts={shifts}
        setShifts={setShifts}
        open={open}
        setOpen={setOpen}>
      </ShiftModal>
      <DataTable nurses={nurses} shifts={shifts} />
    </div>
  );
}

export default App;
