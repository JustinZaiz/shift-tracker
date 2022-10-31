import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const DataTable = ({ nurses, shifts }) => {
    const headers = ['Shift','Start Time','End Time','Certification required','Assigned Nurse'];
    function nurseString(shift) {
        const filteredNurse = nurses.filter(nurse => nurse.id == shift.nurse_id)
        if (filteredNurse[0] === undefined) {
            return null;
        } else {
            return filteredNurse[0].first_name+' '+filteredNurse[0].last_name+', '+filteredNurse[0].qualification
        }
    }

const dataCells = [ "name", "start", "end", "qual_required"];
  
return (
    <Paper>
      <hr />
      <Table>
        <TableHead>
          <TableRow>
            {headers.map(header => (
              <TableCell align="right">{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {shifts.map((shift, index) => (
            <TableRow key={index}>
              {dataCells.map(dataCell => (
                <TableCell align="right">{shift[dataCell]}</TableCell>
              ))}
              <TableCell align="right">{shift['nurse_id'] !== null ? nurseString(shift) : null }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default DataTable;