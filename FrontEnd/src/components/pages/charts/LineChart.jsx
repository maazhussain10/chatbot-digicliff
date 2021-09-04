import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

const LineChart = (props) => {
  const [activeChatbots, setActiveChatbots] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(props.val);
    let tempData = [];
    tempData.push(['x', 'king', 'kong', 'kingkong']);
    let { existingChatbots } = props;
    for (let i = 0; i < existingChatbots.length; i++) {
      let temp = [];
      temp.push(existingChatbots[i].createdAt.slice(0, 4));
      for (let j = 0; j < existingChatbots.length; j++) {
        if (
          existingChatbots[i].createdAt.slice(0, 4) ===
            existingChatbots[j].createdAt.slice(0, 4) &&
          existingChatbots[j].status === true
        ) {
          temp.push(Object.keys(existingChatbots[j].visitorDetails).length);
        }
      }
      tempData.push(temp);
    }
    setData(tempData);
    console.log(data);
  }, [props.existingChatbots]);

  return (
    <div>
      <Chart
        width={'400px'}
        height={'200px'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
          hAxis: {
            title: 'Date',
          },
          vAxis: {
            title: 'No of Visitors',
          },
          series: {
            1: { curveType: 'function' },
          },
        }}
        rootProps={{ 'data-testid': '3' }}
      />
    </div>
  );
};

export default LineChart;
