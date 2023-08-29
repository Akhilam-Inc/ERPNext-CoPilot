import React  from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react'

const StatRenderer = ({message}) => {
  	return (
    <StatGroup gap={10}>
      {
        message.content.map( stat => {
          return (
            <Stat key = {stat.title}>
            <StatLabel>{stat.title}</StatLabel>
            <StatNumber>{stat.amount}</StatNumber>
            <StatHelpText>
              <StatArrow type= {stat.type} />
              {stat.percentage}
            </StatHelpText>
          </Stat>
          );
        })
      }
    </StatGroup>
	);
};
  
export default StatRenderer;
  
