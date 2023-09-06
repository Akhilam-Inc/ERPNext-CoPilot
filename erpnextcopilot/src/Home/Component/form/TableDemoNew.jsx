import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Button
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, CheckIcon } from "@chakra-ui/icons";
import ChildLinkField from "./ChildLinkField";


function TableDemo({ key, values, singleRowData, schemas, onItemChange }) {
  // Creating style object  
  const [open,setOpen] = useState(false);
  // Defining a state named rows
  // which we can update by calling on setRows function
  const [rows, setRows] = useState(values);
  const [singleRow, setSingleRow] = useState(singleRowData);

  const [isEdit, setEdit] = React.useState(false);
  const [disable, setDisable] = React.useState(true);

  // Function For adding new row object
  const handleAdd = () => {
    setRows([
      ...rows,
      {
        ...singleRow
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
    onItemChange(rows);
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
              {Object.keys(singleRow).map((key) => {
                return <>
                  <Td component="th" scope="row">
                    {camelToTitleCase(key.toString())}
                  </Td>
                </>;
              })}
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
                        {Object.entries(row).map((entry) => {
                          var key = entry[0]
                          var value = entry[1]
                          return <>
                            <Td padding="none" component="th" scope="row">
                              {schemas[key].type == "Link" ?
                                <ChildLinkField name={key}
                                value={value}
                                reference = {row[schemas[key].options]}
                                onChange={(e) => handleInputChange({target : { name : key, value : e.value}}, i)}
                                schema = {schemas[key]}
                                />
                              
                                : <input required = {schemas[key].reqd == 1}
                                  value={value}
                                  name={key}
                                  onChange={(e) => handleInputChange(e, i)}
                                />}
                            </Td>
                          </>;
                        })}
                        <Td
                          component="th"
                          scope="row"
                          align="center"
                        ></Td>
                      </>
                    ) : (
                      <>
                        {Object.values(row).map((value) => {
                          return <>
                            <Td component="th" scope="row">
                              {value}
                            </Td>
                          </>;
                        })}
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

function camelToTitleCase(str) {
  var camel = snakeToCamel(str);
  var pascalCase = camel.charAt(0).toUpperCase() + camel.substr(1);
  return pascalCase
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z])([0-9])/gi, '$1 $2')
    .replace(/([0-9])([a-z])/gi, '$1 $2').replace('_', " ");
}

const snakeToCamel = s => s.replace(/(_\w)/g, k => k[1].toUpperCase())

export default TableDemo;

