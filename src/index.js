import React from 'react'
import ReactDOM from 'react-dom'
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'

import App from './App'

import 'typeface-roboto'
import './static/css/common.css'
import './static/css/animate.css'
import './static/css/app1.css'
import './static/css/app2.css'
import './static/css/cognitive.css'
import './static/css/style.css'

class SiteMap extends React.Component{

	render() {
		return (
			<Router>
				<div>
					<div>
						<Route exact path="/" component={App}/>
						<Route exact path="/home" component={App}/>
						<Route exact path="/dashboard" component={App}/>
						<Route exact path="/mapping" component={App}/>
						<Route exact path="/artifacts" component={App}/>
						<Route exact path="/new_obligation" component={App}/>
						<Route exact path="/reports" component={App}/>
					</div>
				</div>
			</Router>
		);
	}
}

ReactDOM.render(
	<SiteMap />,
	document.getElementById('root')
);