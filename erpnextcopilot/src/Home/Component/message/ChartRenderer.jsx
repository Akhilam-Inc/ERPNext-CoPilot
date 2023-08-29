import React from "react";
import Chart from "react-apexcharts";
const ChartRenderer = ({message}) => {
	return (
        <Chart
              options={message.content.options}
              series={message.content.series}
              type= {message.chart_type}
              width="500"
            />
	);
  };
  
  export default ChartRenderer;
  
