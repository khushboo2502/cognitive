import React from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/core/Icon'
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

import SignIn_BG from '../static/images/SignIn_BG.jpg'
import Header from './Header'

const styles = theme => ({
  paper: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  loaderRoot: {
    marginTop: theme.spacing.unit * 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

class SignIn extends React.Component{
  constructor(props){
      super(props)
        
      this.state = {
        SignIn:false,
        username:null,
        password:null,
        loading: false,
        showSnackbar:false,
      }
    }

  handleChange = (event) => {
    const target = event.target
    var partialState = {}
    partialState[target.name] = target.value
    this.setState(partialState)
  }

  SignIn = () => {
    this.setState({loading:true})
    var data = { 
      "clientId": "GoInsurance",
      "tenantId": "Nexright",
      "username": this.state.username,
      "password": this.state.password,
      "role": "admin"
    }
    if (this.state.username!=null&&this.state.username!=' '&& this.state.password!=null&& this.state.password!=' ') {
      axios.post('http://130.198.70.163:3000/cognitiveInsightsRestService/loginuser',data)
      .then(response => {
        this.setState({loading:false})
        console.log("response",response.data)
        if(response.data=="Login Success"){
          localStorage.setItem("SignIn", true)
          window.reload()
          this.setState({showSnackbar:true,snackbarColor:'#06A04B',msgSnackbar:'Welcome Back User'})
        }else{
          this.setState({showSnackbar:true,snackbarColor:'#EC1C19',msgSnackbar:response.data})
        }
      })
      .catch(error => {
        this.setState({loading:false,showSnackbar:true,snackbarColor:'#EC1C19',msgSnackbar:'Login Error, Please Enter Correct Data'})
        console.log(error)
      })
    }else{
      this.setState({loading:false,showSnackbar:true,snackbarColor:'#EC1C19',msgSnackbar:'Login Error, Please Enter Correct Username & Password'})
    }
  }

  handleClose = (event, reason) => {
    this.setState({ showSnackbar: false })
  }

  render() {
    const { classes } =  this.props

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
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Icon>lock</Icon>
        </Avatar>
        <Typography variant="headline">Sign in</Typography>
        <form className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="username">User Name</InputLabel>
            <Input 
              id="username" 
              name="username" 
              autoComplete="username" 
              autoFocus 
              onChange={this.handleChange} 
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.handleChange}
            />
          </FormControl>
          <Button
            fullWidth
            variant="raised"
            color="primary"
            className={classes.submit}
            onClick={this.SignIn}
          >
            Sign in
          </Button>
        </form>
      </Paper>
      <div className={classes.loaderRoot}>
        <Fade
          in={this.state.loading}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
      </div>
    </div>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);