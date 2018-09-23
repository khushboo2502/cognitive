import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress';

import Line from './charts/Line'
import Bar from './charts/Bar'
import EnhancedTable from './EnhancedTable'
import {readFileContent} from '../helpers/util'

// const URL = 'http://130.198.70.163:8080'
const URL = 'http://localhost:8080';

const styles = theme => ({
  card: {
    textAlign: 'center',
    marginTop:'20px',
    height: '120px',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    float:'right',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class Dashboard extends React.Component {
  constructor(props){
    super(props)
    this.state={
      responseData:null,
      loading:false
    }
  }

  handleChange = (event) => {
    let file = event.target.files[0]
    if (file) {
      this.setState({loading:true})
      readFileContent(file).then((data)=>{
        axios.post(URL+'/uploadCSV',{data:data})
        .then(response => {
          this.setState({loading:false})
          document.getElementById("outlined-button-file").value = ""
          window.location.reload()
        })
        .catch(error => {
          this.setState({loading:false})
          document.getElementById("outlined-button-file").value = ""
          console.log(error)
        })
      })
    }
  }

  handleChangeX = (event) => {
    let file = event.target.files[0]
    if (file) {
      readFileContent(file).then((x)=>{ 
        let data=JSON.parse(x)
        
        let sentences = data.text.split('\n')
        let array = []
        array.push(['conversation_id','speaker_name','speaker_type','text','utterance_id'])
        for(let index in sentences){
          if(sentences[index]){
            let x = Number(index)+1
            array.push([data.conversation_id,data[data['Turn'+x].speaker+'_name'],data['Turn'+x].speaker,sentences[index],parseInt(index)+1])
          }
        }

        console.log(array)
        
        var csvFile = '';
        for (var i = 0; i < array.length; i++) {
          let finalVal = '';
          for (let j = 0; j < array[i].length; j++) {
          let innerValue = array[i][j] === null ? '' : array[i][j].toString();
          if (array[i][j] instanceof Date) {
          innerValue = array[i][j].toLocaleString();
          };
          let result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0)
          result = '"' + result + '"';
          if (j > 0)
          finalVal += ',';
          finalVal += result;
          }
          csvFile += finalVal + '\n'
        }

        console.log(csvFile)

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, 'test.csv');
        } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = window.URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", 'test.csv');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          }
        }
      })
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <form className={classes.container} noValidate style={{paddingRight:'25px'}}>
          <TextField
            id="date"
            label="From Date"
            type="date"
            defaultValue="2018-09-06"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="date"
            label="To Date"
            type="date"
            defaultValue="2018-09-06"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </form>

        <div className="col-md-12 col-sm-12">
          <div className="col-md-3 col-sm-3">
            <Card className={classes.card} style={{backgroundColor:'#FF2A76'}}>
              <CardContent>
                <Typography variant="headline" component="h2" className="c-white">
                  Total Alerts <br/> 77
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-3 col-sm-3">
            <Card className={classes.card} style={{backgroundColor:'#3752B4'}}>
              <CardContent>
                <Typography variant="headline" component="h2" className="c-white">
                  Artifacts <br/> 5
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-3 col-sm-3">
            <Card className={classes.card} style={{backgroundColor:'#00A89C'}}>
              <CardContent>
                <Typography variant="headline" component="h2" className="c-white">
                  Incidents <br/> 7
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-3 col-sm-3">
            <Card className={classes.card} style={{backgroundColor:'#0097F4'}}>
              <CardContent>
                <Typography variant="headline" component="h2" className="c-white">
                  Breaches <br/> 6
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-3 col-sm-3">
            <Card className={classes.card} style={{backgroundColor:'#567D8B'}}>
              <CardContent>
                <Typography variant="headline" component="h2" className="c-white">
                  Alerts Per Controls <br/> 13
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-3 col-sm-3">
            <Card className={classes.card} style={{backgroundColor:'#FF9100'}}>
              <CardContent>
                <Typography variant="headline" component="h2" className="c-white">
                  Alerts By Agents/Advisers<br/> 17
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-3 col-sm-3">
            <Card className={classes.card} style={{backgroundColor:'#77C453'}}>
              <CardContent>
                <Typography variant="headline" component="h2" className="c-white">
                  Alerts By Types <br/> 14
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-3 col-sm-3">
            <Card className={classes.card} style={{backgroundColor:'#805448'}}>
              <CardContent>
                <Typography variant="headline" component="h2" className="c-white">
                  Alerts By Regulations <br/> 15
                </Typography>
              </CardContent>
            </Card>
          </div>
          {
            // <div className="col-md-6 col-sm-6">
            //   <Line />
            // </div>
            // <div className="col-md-12">
            //   <Bar />
            // </div>
            // <div className="col-md-12 col-sm-12">
            //   <EnhancedTable />
            // </div>
          }
        </div>

        {
        // <div  className="col-md-12 p-l-30 p-r-30 p-t-30 m-t-30">
        //   <Paper className="col-md-12 p-10">
        //     <Typography variant="display1" className="col-md-10 pull-left m-t-5 c-black">
        //       Customer Engagement Analytics
        //     </Typography>
        //     <input
        //       accept='.csv'
        //       className='hide'
        //       id="outlined-button-file"
        //       multipleimage
        //       type="file"
        //       onChange={this.handleChange}
        //     />
        //     <label htmlFor="outlined-button-file" className="col-md-2 pull-right m-t-5">
        //       <Button
        //         component="span"
        //         variant="contained"
        //         color="primary"
        //         disabled={this.state.loading}>
        //         {!this.state.loading? 'Upload':'Uploading'}&nbsp;&nbsp;{this.state.loading ? <CircularProgress size={24} /> : <Icon>cloud_upload</Icon>}
        //       </Button>
              
        //     </label>
        //   </Paper>
        // </div>
        }

        <div className="col-md-12 col-sm-12">
          <div className="box p-15" style={{position:'relative',marginTop:'30px'}} >
            <div className="col-md-12 box inner center" id='searchBlockTop' style={{display:'none'}}>
              <p className='searchInfo' id='searchInfoTop'></p>
              <div data-search className="bx--search bx--search--sm searchBox" role="search">
                <svg className="bx--search-magnifier" width="16" height="16" viewBox="0 0 16 16" fill-rule="evenodd">
                  <path d="M6 2c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0-2C2.7 0 0 2.7 0 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zM16 13.8L13.8 16l-3.6-3.6 2.2-2.2z"></path>
                  <path d="M16 13.8L13.8 16l-3.6-3.6 2.2-2.2z"></path>
                </svg>
                <label id="search-input-label-1" className="bx--label" for="search_input_top">Search</label>
                <input className="bx--search-input" type="text" id="search_input_top" role="search" placeholder="Search Products, Agents and Customers..." aria-labelledby="search-input-label-1"/>
                <svg className="bx--search-close" width="16" height="16" viewBox="0 0 16 16" fill-rule="evenodd">
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 10.1l-1.4 1.4L8 9.4l-2.1 2.1-1.4-1.4L6.6 8 4.5 5.9l1.4-1.4L8 6.6l2.1-2.1 1.4 1.4L9.4 8l2.1 2.1z"></path>
                </svg>
              </div>
            </div>
            <ul className="nav nav-tabs" style={{fontSize: '14px'}}>
              <li className="active">
                <a data-toggle="tab" href="#menu1">
                  <span className="tab-container tab-header">Customer Satisfaction</span>
                  <span className="tab-container tab-question">How satisfied are customers with our service, by product?</span>
                </a>
              </li>
              <li>
                <a data-toggle="tab" href="#menu2">
                  <span className="tab-container tab-header">Customer Concerns</span>
                  <span className="tab-container tab-question">What are the top concerns our customers discuss?</span>
                </a>
              </li>
              <li>
                <a data-toggle="tab" href="#menu3">
                  <span className="tab-container tab-header">Agent Performance</span>
                  <span className="tab-container tab-question">How are our agents performing based on customer tones?</span>
                </a>
              </li>
              <li>
                <a data-toggle="tab" href="#menu4">
                  <span className="tab-container tab-header">Initial Customer Tones</span>
                  <span className="tab-container tab-question">What are our customers' tones in their first interaction with us?</span>
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div id='menu1' className="tab-pane fade in active">
                <div id="chart1" className='inner'></div>
              </div>
              <div id='menu2' className="tab-pane fade">
                <div id="chart2" className='inner'></div>
              </div>
              <div id='menu3' className="tab-pane fade">
               <div id="chart3" className='inner'></div>
              </div>
               <div id='menu4' className="tab-pane fade">
                <div id="chart4" className='inner'></div>
              </div>
            </div>
          </div>
        </div>

        {
        // <div id='loadingSpinner' className="bx--loading-overlay" style={{display:'none'}}>
        //   <div data-loading className="bx--loading">
        //     <svg className="bx--loading__svg" viewBox="-75 -75 150 150">
        //       <circle cx="0" cy="0" r="37.5" />
        //     </svg>
        //   </div>
        // </div>

        // <div className="col-md-12 col-sm-12">
        //   <div className="box p-30">
        //     <div className="row">
        //       <div className="col box inner">
        //         <span id="tag-info" data-cloud-name="filter-tag-cloud"></span> <a onclick="clearFilter()" style={{cursor: 'pointer'}} id='filterReset'></a>
        //         <h6><span id="conversationHeader"></span> With Customer Service Agents</h6>
        //         <div className="conversation-extractions">
        //           <div className="col-md-6 box inner">
        //             <div id='agentPanel' className="extraction-panel"></div>
        //           </div>
        //           <div className="col-md-6 box inner">
        //             <div id='customerPanel' className="extraction-panel"></div>
        //           </div>
        //         </div>
        //         <div className="col-md-12 box inner">
        //           <div className="input-group">
        //             <span className="form-control" id="filterHeader">Number of Statements</span>
        //             <span className="input-group-btn" >
        //               <button type="button" className="btn btn-default" data-value="decrease" data-target="#spinner" data-toggle="spinner">
        //                 <span className="glyphicon glyphicon-minus"></span>
        //               </button>
        //             </span>
        //             <input type="text" data-ride="spinner" id="spinner" className="form-control input-number" value="2" />
        //             <span className="input-group-btn">
        //               <button type="button" className="btn btn-default" data-value="increase" data-target="#spinner" data-toggle="spinner">
        //                 <span className="glyphicon glyphicon-plus"></span>
        //               </button>
        //             </span>
        //           </div>
        //           <div id="conversationLegend"></div>
        //           <div className='content' id="content" style={{marginTop: '20px',height:'300px',overflowY: 'auto'}}></div>
        //           <nav aria-label="Page navigation" style={{textAlign:'center'}}>
        //             <ul className="pagination" id="pagination"></ul>
        //           </nav>
        //         </div>
        //         <div className="col-md-12 box inner center" id='searchBlockBottom'>
        //           <p className='searchHeader'>Would you like to dig deeper into the data? </p>
        //           <p className='searchInfo'>Filter all conversations by Product, Agent or Customer Name</p>
        //           <div data-search className="bx--search bx--search--sm searchBox" role="search">
        //             <svg className="bx--search-magnifier" width="16" height="16" viewBox="0 0 16 16" fill-rule="evenodd">
        //               <path d="M6 2c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0-2C2.7 0 0 2.7 0 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zM16 13.8L13.8 16l-3.6-3.6 2.2-2.2z"></path>
        //               <path d="M16 13.8L13.8 16l-3.6-3.6 2.2-2.2z"></path>
        //             </svg>
        //             <label id="search-input-label-1" className="bx--label" for="search_input_bottom">Search</label>
        //             <input className="bx--search-input" type="text" id="search_input_bottom" role="search" placeholder="Search Products, Agents and Customers..." aria-labelledby="search-input-label-1" />
        //             <svg id='bx--search-close' className="bx--search-close bx--search-close--hidden" width="16" height="16" viewBox="0 0 16 16" fill-rule="evenodd">
        //               <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 10.1l-1.4 1.4L8 9.4l-2.1 2.1-1.4-1.4L6.6 8 4.5 5.9l1.4-1.4L8 6.6l2.1-2.1 1.4 1.4L9.4 8l2.1 2.1z"></path>
        //             </svg>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        }
        

      </div>
    )
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Dashboard)