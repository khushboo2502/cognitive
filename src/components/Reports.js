import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    width: 'auto',
  },
});

class Reports extends React.Component {
  constructor(props){
    super(props)
    this.state={
      responseData:null
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Paper className="m-t-10 p-20">
          <Typography component="p">
            Reports Coming Soon.....
          </Typography>
        </Paper>
      </div>
    )
  }
}

Reports.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Reports)