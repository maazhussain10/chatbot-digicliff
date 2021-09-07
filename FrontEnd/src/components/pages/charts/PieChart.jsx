import React, { useEffect,useState } from 'react';
import { Chart } from 'react-google-charts';

const PieChart = (props) => {

  const [data, setData] = useState([])
  useEffect(() => {
    let { chatbots } = props;
    let pieChartData = []
    pieChartData = [["Chatbot", "Duration"]];
    for (let i = 0; i < chatbots.length; i++) {
      if (chatbots[i].status) {
          let temp = [];
          temp.push(chatbots[i].chatbotName)
          temp.push(parseInt(chatbots[i].botDuration))
          pieChartData.push(temp);
      }
    }
    console.log("PPPP",pieChartData)
    setData(pieChartData)
  }, [props])

  return (
    <Chart
      width={'600px'}
      height={'600px'}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        title: "Time Duration",
        // Just add this option
        is3D: true,
      }}
      rootProps={{ 'data-testid': '2' }}
    />
  );
};

export default PieChart;
