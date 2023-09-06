import React  from "react";
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
	Tab
} from '@chakra-ui/react'
import { useToken } from '@chakra-ui/react'

const TableRenderer = ({message}) => {
	const bg = useToken('colors', 'green.500')
	
	var tableRows = [];
	const values = [];

	message.content.map((d) => {
		tableRows = Object.keys(d);
		values.push(Object.values(d));
	});

	return (
		<TableContainer>
		<Table size='sm'>
			<Thead>
				<Tr>
					{tableRows.map((rows, index) => {
						return <Th key={index} bg={bg + '!important'} textColor="black">{rows}</Th>;
					})}
				</Tr>
			</Thead>
			<Tbody>
				{values.map((value, index) => {
					return (
						<Tr key={index}>
							{value.map((val, i) => {
								return <Td key={i}>{val}</Td>;
							})}
						</Tr>
					);
				})}

			</Tbody>

		</Table>
	</TableContainer>
	);
  };
  
  export default TableRenderer;
  
