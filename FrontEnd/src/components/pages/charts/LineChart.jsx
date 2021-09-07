import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

const LineChart = (props) => {
  const [activeChatbots, setActiveChatbots] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    let { chatbots } = props;
    let lineChartData = [];

    lineChartData.push(['Cities']);

    let distinctCities = [];
    for (let i = 0; i < chatbots.length; i++) {
      for (let j = 0; j < chatbots[i].visitors.length; j++)
        if (
          !distinctCities.includes(chatbots[i].visitors[j].city) &&
          chatbots[i].status
        ) {
          distinctCities.push(chatbots[i]?.visitors[j].city);
        }
    }

    for (let i = 0; i < chatbots.length; i++) {
      if (chatbots[i].status) {
        lineChartData[0].push(chatbots[i].chatbotName);
      }
    }

    for (let j = 0; j < distinctCities.length; j++) {
      let temp = [];
      temp.push(distinctCities[j]);
      for (let k = 0; k < chatbots.length; k++) {
        if (chatbots[k].status) {
          let visitorCount = chatbots[k]?.visitors.filter(
            (obj) => obj.city === distinctCities[j]
          ).length;
          temp.push(visitorCount);
        }
      }
      if (temp.length !== 0) lineChartData.push(temp);
    }
    setData(lineChartData);
  }, [props]);

  return (
    <div>
      <Chart
        width={'400px'}
        height={'200px'}
        chartType="Bar"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
          chart: {
            // title: 'Location with visitors count'
          },
        }}
        rootProps={{ 'data-testid': '3' }}
      />
    </div>
  );
};

export default LineChart;
