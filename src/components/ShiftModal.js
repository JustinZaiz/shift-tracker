import { useState } from 'react';
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import moment from 'moment'
import Button from "@mui/material/Button";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  };
  
const ShiftModal = ({nurses, shifts, setShifts, open, setOpen }) => {
  const [shift, setShift] = useState([]);
  const [nurse, setNurse] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [qualificationError, setQualificationError] = useState(false);
  const [timeConflictError, setTimeConflictError] = useState(false);

  const handleShiftChange = (SelectChangeEvent) => {
    setDisabled(true);
    setShift(SelectChangeEvent.target.value);
    if(SelectChangeEvent.target.value === '') {
      setDisabled(true);
    } else if (qualificationError === false && timeConflictError === false) {
        setDisabled(false);
    }
  };

  const handleNurseChange = (SelectChangeEvent) => {

    setDisabled(true);
    setNurse(SelectChangeEvent.target.value);
    const currentNurse = SelectChangeEvent.target.value;
    if(currentNurse.qualification === 'CNA' && (shift.qual_required === 'LPN' || shift.qual_required === 'RN')) {
      setQualificationError(true);
    }
    if(currentNurse.qualification === 'LPN' && shift.qual_required === 'RN') {
      setQualificationError(true);
    }
    if(qualificationError === false && timeConflictError === false) {

      setDisabled(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setShift('');
    setNurse('');
    setDisabled(true);
    setQualificationError(false);
    setTimeConflictError(false);
  };

  function handleSave(event) {
    event.preventDefault();

    if(qualificationError === false && timeConflictError === false) {
      editShift(shift.id, nurse.id)
    }
  }

  const editShift = async (shiftId, nurseId) => {

    const body = JSON.stringify({ nurseID: nurseId });
    const res = await fetch(`/shifts/${shiftId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
    const data = await res.json()

    setShifts(
      shifts.map((singleShift) =>
        singleShift.id === shiftId ? { ...singleShift, nurse_id: data.nurseID } : singleShift
      )
    )
  }

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            Set Shift Assignment
        </Typography>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="shift-select-label">Shift</InputLabel>
            <Select
            defaultValue=""
            labelId="shift-select-label"
            id="shift-select"
            value={shift}
            label="Shift"
            onChange={handleShiftChange}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {shifts.map(shift => (
                <MenuItem key={shift.id} value={shift}>{shift.name+': '+moment(shift.start).format('LTS')+'-'+moment(shift.end).format('LTS')+' ('+shift.qual_required+')'}</MenuItem>
            ))}
            </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="nurse-select-label">Nurse</InputLabel>
            <Select
            defaultValue=""
            labelId="nurse-select-label"
            id="nurse-select"
            value={nurse}
            label="Nurse"
            onChange={handleNurseChange}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {nurses.map(nurse => (
                <MenuItem value={nurse}>{nurse.first_name+' '+nurse.last_name+' '+nurse.qualification}</MenuItem>
            ))}
            </Select>
            {qualificationError ? <Alert severity="warning">
            This nurse isn't qualified to work the chosen shift.
            </Alert> : <></> }
            {timeConflictError ? <Alert severity="warning">
            This nurse is already working during the chosen shift.
            </Alert> : <></> }
        </FormControl>
        <Button variant='contained' disabled={disabled} onClick={handleSave}>Save Assignment</Button>
        </Box>
    </Modal>
  );
}
export default ShiftModal;