import React from 'react';
import { Chart } from 'react-google-charts';

const PieChart = (props) => {
    console.log(props.  chatbots);

  return (
    <Chart
      width={'250px'}
      height={'250px'}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={[
        ['Task', 'Hours per Day'],
        ['Work', 11],
        ['Eat', 2],
        ['Commute', 2],
        ['Watch TV', 2],
        ['Sleep', 7],
      ]}
      options={{
        title: 'My Daily Activities',
        // Just add this option
        is3D: true,
      }}
      rootProps={{ 'data-testid': '2' }}
    />
  );
};

export default PieChart;
