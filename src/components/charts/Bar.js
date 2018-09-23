import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
const data = [
      {name: 'Page A', incidents: 4000, artifacts: 2400, breaches: 2400},
      {name: 'Page B', incidents: 3000, artifacts: 1398, breaches: 2210},
      {name: 'Page C', incidents: 2000, artifacts: 9800, breaches: 2290},
      {name: 'Page D', incidents: 2780, artifacts: 3908, breaches: 2000},
      {name: 'Page E', incidents: 1890, artifacts: 4800, breaches: 2181},
      {name: 'Page F', incidents: 2390, artifacts: 3800, breaches: 2500},
      {name: 'Page G', incidents: 3490, artifacts: 4300, breaches: 2100},
];
class SimpleBarChart extends React.Component {
	render () {
  	return (
    	<BarChart width={600} height={300} data={data} margin={{ top: 50, right: 0, bottom: 5, left: 0 }}>
		   <CartesianGrid strokeDasharray="5 5"/>
	       <XAxis dataKey="name"/>
	       <YAxis/>
	       <Tooltip/>
	       <Bar dataKey="artifacts" stackId="a" fill="#8884d8" />
	       <Bar dataKey="breaches" stackId="a" fill="#82ca9d" />
	       <Bar dataKey="incidents" fill="#ffc658"/>
      </BarChart>
    );
  }
}

export default SimpleBarChart