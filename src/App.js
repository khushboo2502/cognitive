import React from 'react'

import Header from './components/Header'
import SignIn from './components/SignIn'

class App extends React.Component{

  render(){
    var pathname={pathname:(this.props.location.pathname)?this.props.location.pathname:'/'}
    console.log('pathname',pathname)
    return(
      <div>
        {(localStorage.getItem("SignIn")== "true") ?
          <Header 
            location={pathname}
          />
          :
          <SignIn />
        }
      </div>
    )
  }
}

export default App