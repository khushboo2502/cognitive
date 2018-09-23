import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
const data = [
      {name: 'Page A', incidents: 4000, artifacts: 2400, breaches: 2400},
      {name: 'Page B', incidents: 3000, artifacts: 1398, breaches: 2210},
      {name: 'Page C', incidents: 2000, artifacts: 9800, breaches: 2290},
      {name: 'Page D', incidents: 2780, artifacts: 3908, breaches: 2000},
      {name: 'Page E', incidents: 1890, artifacts: 4800, breaches: 2181},
      {name: 'Page F', incidents: 2390, artifacts: 3800, breaches: 2500},
      {name: 'Page G', incidents: 3490, artifacts: 4300, breaches: 2100},
];
class SimpleLineChart extends React.Component {
	render () {
  	return (
    	<LineChart width={600} height={300} data={data} margin={{ top: 55, right: 0, bottom: 5, left: 0 }}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Line type="monotone" dataKey="incidents" stroke="#8884d8" activeDot={{r: 8}}/>
        <Line type="monotone" dataKey="artifacts" stroke="#82ca9d" />
        <Line type="monotone" dataKey="breaches" stroke="#ffc658" />
      </LineChart>
    );
  }
}

export default SimpleLineChart