import React from "react"
import axios from 'axios'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import SwipeableViews from 'react-swipeable-views'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'

import {readFileContent} from '../helpers/util'

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 'auto',
    minHeight: '640px',
    display: 'flow-root',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  CardActions:{
    float: 'right'
  },
  flex: {
    flexGrow: 1,
  },
  loaderRoot: {
    marginTop: theme.spacing.unit * 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

class Artifacts extends React.Component {
  constructor(props){
    super(props)
    this.state={
      responseData:null,
      leftParagraph:[],
      acceptedData:[],
      rejectedData:[],
      uploadedFileName:'File Name',
      showSnackbar:false,
      snackbarColor:'#0975CE',
      value: 0,
      colorCode:[],
      matchedObligation:null,
      loading: false,
    }
  }

  handleChange = (event) => {
    let file = event.target.files[0]
    this.setState({uploadedFileName:'Call Log01',loading:true})
    if (file) {
      var leftParagraph= []
      readFileContent(file).then((paragraph)=>{
        var p = paragraph.substring(0, paragraph.length-1)
        var res = p.split(".")
        for(var i=0; i<res.length; i++){
          leftParagraph.push(res[i])
        }
        let data = {
        "clientId": "shajidsdemoid",
        "tenantId": "shajid",
        "artifact": paragraph
        }
        axios.post('http://130.198.70.163:3000/cognitiveInsightsRestService/artifactAutoDiscovery',data)
        .then(response => {
          this.setState({loading:false})
          console.log("response",response)
          var colorCode = []
          var matchedObligation= []
          for (var i in response.data) {
            var rgb = ''
            for(var j = 0; j < 3; j++){
              rgb=rgb+String.fromCharCode(65+Math.floor(Math.random() * 6));
            }
            colorCode.push(rgb)
            for(var j in leftParagraph){
              if ( (i.substring(0, i.length-1))==leftParagraph[j].trim()) {
                  matchedObligation.push({colorCode:rgb,text:i})
                  break;
                }
            }
            rgb=[]
          }
          this.setState({responseData:response.data,colorCode:colorCode,matchedObligation:matchedObligation,leftParagraph:leftParagraph,value:0})
          document.getElementById("outlined-button-file").value = ""
        })
        .catch(error => {
          document.getElementById("outlined-button-file").value = ""
          console.log(error)
        })
      })
    }
  }

  insertInDB = (text,type) => () => {
    if (type=='Accepted') {
      this.state.acceptedData.push(text)
      this.setState({showSnackbar:true,snackbarColor:'#06A04B',msgSnackbar:'Obligation is Accepted'})
    } else if (type=='Rejected') {
      this.state.rejectedData.push(text)
      this.setState({showSnackbar:true,snackbarColor:'#EC1C19',msgSnackbar:'Obligation is Rejected'})
    }
    let matchedObligation = this.state.responseData
    for(var i in matchedObligation){
      if ( i == text) {
        delete matchedObligation[i]
      }
    }
    this.setState({responseData:matchedObligation},() =>{
      if(Object.keys(this.state.responseData).length==0){
        if (this.state.acceptedData.length>0) {
          console.log('accepted',this.state.acceptedData)
        }
        if (this.state.rejectedData.length) {
          console.log('rejected',this.state.rejectedData)
          var data = { 
            "clientId": "shajidsdemoid",
            "tenantId": "shajid", 
            "rejectedObligations": this.state.rejectedData 
          }
          axios.post('http://130.198.70.163:3000/cognitiveInsightsRestService/insertRejectedObligations',data)
          .then(response => {
            console.log("response",response)
          })
          .catch(error => {
            console.log(error)
          })
        }
      }
    })
  }

  handleClose = (event, reason) => {
    this.setState({ showSnackbar: false })
  }

  handleChangeTab = (event, value) => {
    this.setState({ value })
  }

  handleChangeIndex = index => {
    this.setState({ value: index })
  }

  render() {
    const { classes, theme } = this.props

    let Obligation = []
    if (this.state.value==0) {
      var count = 1;
      for(var i in this.state.responseData){
        var color=''
        for(var j in this.state.matchedObligation){
          if (i==this.state.matchedObligation[j].text) {
            color='#'+ this.state.matchedObligation[j].colorCode
            break;
          }
        }
        Obligation.push(
          <Card className="m-b-10">
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe" style={{background:color,borderColor:color,color:'#000'}}>
                  {count}
                </Avatar>
              }
              title={i}
            />
            <CardActions className={classes.CardActions} >
              <Button onClick={this.insertInDB(i,'Accepted')} size="small" color="primary">
                Accept
              </Button>
              <Button onClick={this.insertInDB(i,'Rejected')} size="small" color="primary">
                Reject
              </Button>
            </CardActions>
          </Card>
        )
        count = count+1;
      }
    }
    if (this.state.value==1) {}
    if (this.state.value==2) {
      var count = 1;
      for(var i in this.state.acceptedData){
        var color=''
        for(var j in this.state.matchedObligation){
          if (this.state.acceptedData[i]==this.state.matchedObligation[j].text) {
            color='#'+ this.state.matchedObligation[j].colorCode
            break;
          }
        }
        Obligation.push(
          <Card className="m-b-10">
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe" style={{background:color,borderColor:color,color:'#000'}}>
                  {count}
                </Avatar>
              }
              title={this.state.acceptedData[i]}
            />
          </Card>
        )
        count = count+1;
      }
    }
    if (this.state.value==3) {
      var count = 1;
      for(var i in this.state.rejectedData){
        var color=''
        for(var j in this.state.matchedObligation){
          if (this.state.rejectedData[i]==this.state.matchedObligation[j].text) {
            color='#'+ this.state.matchedObligation[j].colorCode
            break;
          }
        }
        Obligation.push(
          <Card className="m-b-10">
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe" style={{background:color,borderColor:color,color:'#000'}}>
                  {count}
                </Avatar>
              }
              title={this.state.rejectedData[i]}
            />
          </Card>
        )
        count = count+1;
      }
    }

    let paragraph = []
    var color = ''
    for(var i in this.state.leftParagraph){
      for(var j in this.state.matchedObligation){
        if (this.state.leftParagraph[i].trim()==(this.state.matchedObligation[j].text.substring(0, this.state.matchedObligation[j].text.length-1))) {
          color='#'+this.state.matchedObligation[j].colorCode;
          break;
        }else{
          color=''
        }
      }

      paragraph.push(<span><span style={{background:color,padding:'5px',color:'#000',lineHeight:'3',fontSize:'medium'}}>{this.state.leftParagraph[i]}.</span>&nbsp;&nbsp;</span>)
    }
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
        <div className="col-md-12 col-sm-12 p-0">
          <div className="col-md-7 col-sm-7 p-0">
            <AppBar position="static"  color="default">
              <Toolbar style={{minHeight: '48px'}}>
                <Typography variant="title" color="inherit" className={classes.flex}>
                  {this.state.uploadedFileName}
                </Typography>
                <input
                  accept='.txt'
                  className='hide'
                  id="outlined-button-file"
                  multipleimage
                  type="file"
                  onChange={this.handleChange}
                />
                <label htmlFor="outlined-button-file">
                  <Button className='UploadButton' variant="contained" component="span">
                    Upload&nbsp;&nbsp;<Icon>cloud_upload</Icon>
                  </Button>
                </label>
              </Toolbar>
            </AppBar>
            {(paragraph.length>0)&&
              <Paper className="m-t-10 p-20">
                <Typography component="p">
                  {paragraph}
                </Typography>
              </Paper>
            }
          </div>
          <div className="col-md-5 col-sm-5 p-0">
            <AppBar position="static" color="default">
            <Toolbar style={{minHeight: '48px'}}>
              <Tabs
                value={this.state.value}
                onChange={this.handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                fullWidth
              >
                <Tab label={"Candidate ("+Object.keys(this.state.responseData?this.state.responseData:0).length
                +")"} style={{  minWidth: '50px'}} />
                <Tab label="Non-Candidate (0)" style={{  minWidth: '50px'}} />
                <Tab label={"Accepted ("+this.state.acceptedData.length+")"} style={{  minWidth: '50px'}} />
                <Tab label={"Rejected ("+this.state.rejectedData.length+")"} style={{  minWidth: '50px'}} />
              </Tabs>
            </Toolbar>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={this.state.value}
              onChangeIndex={this.handleChangeIndex}
            >
              <TabContainer dir={theme.direction}>
                { Obligation }
              </TabContainer>
              <TabContainer dir={theme.direction}>
                { Obligation }
              </TabContainer>
              <TabContainer dir={theme.direction}>
                { Obligation }
              </TabContainer>
              <TabContainer dir={theme.direction}>
                { Obligation }
              </TabContainer>
            </SwipeableViews>
          </div>
          <center>
            <Fade
              in={this.state.loading}
              unmountOnExit
            >
              <CircularProgress />
            </Fade>
          </center>
        </div>
      </div>
    );
  }
}

Artifacts.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(Artifacts)