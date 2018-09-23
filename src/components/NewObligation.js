import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'

const styles = theme => ({
  paper: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    marginTop: theme.spacing.unit * 8,
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 7}px ${theme.spacing.unit * 3}px`,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
  submit:{
    float:'right'
  }
});

class NewObligation extends React.Component {
  constructor(props){
    super(props)
    this.state={
      responseData:null,
      text:null,
      type:'Incident',
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  createObligation = () => {
    this.setState({loading:true})
    var data = { 
      "clientId": "client1",
      "tenantId": "tenanat1",
      "obligation": this.state.text,
      "obligationAlias": this.state.type
    }
    console.log('this.state.text',this.state.text,this.state.type)
    if (this.state.text!=null&&this.state.text!=''&&this.state.text!=' ') {
      axios.post('http://130.198.70.163:3000/cognitiveInsightsRestService/insertNewObligation',data)
      .then(response => {
        console.log("response",response.data)
        this.setState({loading:false,text:'',showSnackbar:true,snackbarColor:'#06A04B',msgSnackbar:response.data})
      })
      .catch(error => {
        this.setState({loading:false,showSnackbar:true,snackbarColor:'#EC1C19',msgSnackbar:'Error'})
        console.log(error)
      })
    }else{
      this.setState({loading:false,showSnackbar:true,snackbarColor:'#EC1C19',msgSnackbar:'Please Enter, Obligation Description'})
    }
  }

  handleClose = (event, reason) => {
    this.setState({ showSnackbar: false })
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
          open={this.state.showSnackbar}
          autoHideDuration={5000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
            style:{background:this.state.snackbarColor}
          }}
          variant={{backgroundColor: 'red'}}
          message={<span id="message-id">{this.state.msgSnackbar}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <Icon style={{fontSize:'30px'}}>clear</Icon>
            </IconButton>,
          ]}
        />
        <Paper className={classes.paper} elevation={1}>
          <Typography component="p">
            <div className="p-10">
              <TextField
                id="text"
                label="Obligation Description - Required"
                name="text"
                value={this.state.text}
                onChange={this.handleChange('text')}
                type="text"
                margin="normal"
                fullWidth
                multiline
                rowsMax="10"
                type="text"
                autoFocus
              />
              <TextField
                  select
                  fullWidth
                  className={classNames(classes.margin, classes.textField)}
                  label="Select Type"
                  value={this.state.type}
                  onChange={this.handleChange('type')}
                >
                  <MenuItem key="Incident" value="Incident">
                    Incident
                  </MenuItem>
                  <MenuItem key="Breach" value="Breach">
                    Breach
                  </MenuItem>
              </TextField>
              <Button
                variant="raised"
                color="primary"
                className={classes.submit}
                onClick={this.createObligation}
              >
                Submit
              </Button>
            </div>
          </Typography>
        </Paper>
        <center className="m-t-20">
          <Fade
            in={this.state.loading}
            unmountOnExit
          >
            <CircularProgress />
          </Fade>
        </center>
      </div>
    )
  }
}

NewObligation.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(NewObligation)