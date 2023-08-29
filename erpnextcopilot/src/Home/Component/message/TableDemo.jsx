import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TabPanels,
  TabPanel,
  TabList,
  Tabs,
  Tab,
  Button
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, CheckIcon } from "@chakra-ui/icons";


function TableDemo({ key, values, onItemChange }) {
  // Creating style object

  const itemCodes = [
    "Apple1",
    "Apple12",
    "Apple123",
    "Orange1",
    "Orange12",
    "Orange123",
    "Banana1",
    "Banana12",
    "Banana122",
  ];
  // Defining a state named rows
  // which we can update by calling on setRows function
  const [rows, setRows] = useState(values);

  // Initial states
  const [open, setOpen] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [disable, setDisable] = React.useState(true);
  
  // Function For adding new row object
  const handleAdd = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1, item_name: "",
        qty: "", rate: ""
      },
    ]);
    setEdit(true);
  };

  // Function to handle edit
  const handleEdit = (i) => {
    // If edit mode is true setEdit will 
    // set it to false and vice versa
    setEdit(!isEdit);
  };

  // Function to handle save
  const handleSave = () => {
    setEdit(!isEdit);
    setRows(rows);
    onItemChange(rows);
    console.log("saved : ", rows);
    setDisable(true);
    setOpen(true);

  };

  // The handleInputChange handler can be set up to handle
  // many different inputs in the form, listen for changes 
  // to input elements and record their values in state
  const handleInputChange = (e, index) => {
    setDisable(false);
    const { name, value } = e.target;
    const list = [...rows];
    list[index][name] = value;
    setRows(list);
  };

  // Handle the case of delete confirmation where 
  // user click yes delete a specific row of id:i
  const handleRemoveClick = (i) => {
    const list = [...rows];
    list.splice(i, 1);
    setRows(list);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div>
          {isEdit ? (
            <div>
              <Button onClick={handleAdd} style={{ marginRight: '16px' }}>
                <AddIcon onClick={handleAdd} />
                ADD
              </Button>
              {!!rows.length && (
                <Button disabled={!!disable} align="right" onClick={handleSave}>
                  <CheckIcon />
                  SAVE
                </Button>
              )}
            </div>
          ) : (
            <div>
              <Button onClick={handleAdd} style={{ marginRight: '16px' }}>
                <AddIcon onClick={handleAdd} />
                ADD
              </Button>
              <Button align="right" onClick={handleEdit}>
                <AddIcon />
                EDIT
              </Button>
            </div>
          )}
        </div>
      </div>
      <TableContainer>
        <Table key={key}>
          <Tr align="center"> </Tr>
          <Thead>
            <Tr key='head'>
              <Td>Item Code</Td>
              <Td>Item Name</Td>
              <Td>Qty</Td>
              <Td align="center">Rate</Td>
              <Td align="center"></Td>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, i) => {
              return (
                <>
                  <Tr key={'row_' + i}>
                    {isEdit ? (
                      <>
                        <Td padding="none" component="th" scope="row">
                          <select
                            style={{ width: "100px" }}
                            name="item_code"
                            value={row.item_code}
                            onChange={(e) => handleInputChange(e, i)}
                          >
                            <option value=""></option>
                            {itemCodes.filter((item) => item.toLowerCase().includes(row.item_name.toLowerCase())).map((item_code) => {
                              return <option value={item_code}>{item_code}</option>
                            })}
                          </select>
                        </Td>
                        <Td padding="none" component="th" scope="row">
                          <input
                            value={row.item_name}
                            name="item_name"
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </Td>
                        <Td padding="none" component="th" scope="row">
                          <input
                            value={row.qty}
                            name="qty"
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </Td>
                        <Td padding="none" component="th" scope="row">
                          <input
                            value={row.rate}
                            name="rate"
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </Td>
                        <Td
                          component="th"
                          scope="row"
                          align="center"
                        ></Td>
                      </>
                    ) : (
                      <>
                        <Td component="th" scope="row">
                          {row.item_code}
                        </Td>
                        <Td component="th" scope="row">
                          {row.item_name}
                        </Td>
                        <Td component="th" scope="row">
                          {row.qty}
                        </Td>
                        <Td component="th" scope="row" align="center">
                          {row.rate}
                        </Td>
                        <Td
                          component="th"
                          scope="row"
                          align="center"
                        ></Td>
                      </>
                    )}
                    <Td>
                      <Button className="mr10" onClick={() => handleRemoveClick(i)}>
                        <DeleteIcon />
                      </Button>
                    </Td>

                  </Tr>
                </>

              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default TableDemo;