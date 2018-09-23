import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Icon from '@material-ui/core/Icon'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Collapse from '@material-ui/core/Collapse'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Hidden from '@material-ui/core/Hidden'
import { Link } from 'react-router-dom'

import Dashboard from './Dashboard'
import Mapping from './Mapping'
import Artifacts from './Artifacts'
import NewObligation from './NewObligation'
import Reports from './Reports'
import Logo from '../static/images/CognitiveInsights.png'

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    // background:'#0097F4'
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    minHeight: '64px !important',
    maxHeight: '64px !important',
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    height: '-webkit-fill-available'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  listItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
  Link:{
    textDecoration: 'none'
  }
})

class Header extends React.Component {
  constructor(props){
      super(props)
        
      this.state = {
        openSubmenu:false,
        auth: true,
        anchorEl: null,
        mobileOpen: false,
        openSubmenu:false,
        selectedIndex: 0,
      }
    }

  componentDidMount(){
    console.log('this.props',this.props.location.pathname)
    if (this.props.location.pathname === '/' || this.props.location.pathname === '/home' || this.props.location.pathname === '/dashboard') {
      this.setState({ selectedIndex: 0 })
    }else if (this.props.location.pathname === '/mapping') {
      this.setState({ selectedIndex: 1.1,openSubmenu:true })
    }else if (this.props.location.pathname === '/artifacts') {
      this.setState({ selectedIndex: 1.2,openSubmenu:true })
    }else if (this.props.location.pathname === '/new_obligation') {
      this.setState({ selectedIndex: 1.3,openSubmenu:true })
    }else if (this.props.location.pathname === '/reports') {
      this.setState({ selectedIndex: 3})
    }
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }))
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index })
    // console.log('index',index,this.props.location.pathname)
    if (index==1) {
      this.setState(state => ({ openSubmenu: !state.openSubmenu }))
    }
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  logOut = () => {
    localStorage.setItem("SignIn", false)
    window.reload()
  }

  render() {
    const { classes, theme } = this.props
    const { auth, anchorEl } = this.state
    const open = Boolean(anchorEl)

    const drawer = (
      <div>
        <div className={classes.toolbarIcon}>
          <img src={Logo} width='150' alt=""/>
        </div>
        <Divider />
        <List>
          <div className={classes.Link} onClick={()=>{window.location='/dashboard'}}>
            <ListItem 
              className={classes.listItem}
              button 
              selected={this.state.selectedIndex === 0}
              onClick={event => this.handleListItemClick(event, 0)}
            >
              <ListItemIcon className={classes.icon}>
                <Icon>dashboard</Icon>
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} primary="Dashboard" />
            </ListItem>
          </div>
          <ListItem 
            className={classes.listItem}
            button 
            selected={this.state.selectedIndex === 1}
            onClick={event => this.handleListItemClick(event, 1)}
          >
            <ListItemIcon className={classes.icon}>
              <Icon>library_books</Icon>
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }}  primary="Obligations" />
            {this.state.openSubmenu ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
          </ListItem>
          <Collapse in={this.state.openSubmenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link className={classes.Link} to="/mapping">
                <ListItem
                  button 
                  className={classes.nested,classes.listItem}
                  selected={this.state.selectedIndex === 1.1}
                  onClick={event => this.handleListItemClick(event, 1.1)}
                >
                  <ListItemIcon className={classes.icon}>
                    <Icon>swap_horiz</Icon>
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }}  inset primary="Mapping" />
                </ListItem>
              </Link>
              <Link className={classes.Link} to="/artifacts">
                <ListItem
                  button 
                  className={classes.nested,classes.listItem}
                  selected={this.state.selectedIndex === 1.2}
                  onClick={event => this.handleListItemClick(event, 1.2)}
                >
                  <ListItemIcon className={classes.icon}>
                    <Icon>graphic_eq</Icon>
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }}  inset primary="Artifacts" />
                </ListItem>
              </Link>
              <Link className={classes.Link} to="/new_obligation">
                <ListItem
                  button 
                  className={classes.nested,classes.listItem}
                  selected={this.state.selectedIndex === 1.3}
                  onClick={event => this.handleListItemClick(event, 1.3)}
                >
                  <ListItemIcon className={classes.icon}>
                    <Icon>create_new_folder</Icon>
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }}  inset primary="New Obligation" />
                </ListItem>
              </Link> 
            </List>
          </Collapse>
          <Link className={classes.Link} to="/reports">
            <ListItem
              className={classes.listItem}
              button 
              selected={this.state.selectedIndex === 3}
              onClick={event => this.handleListItemClick(event, 3)}
            >
              <ListItemIcon className={classes.icon}>
                <Icon>cloud_download</Icon>
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }}  primary="Reports" />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <ListSubheader inset>Others</ListSubheader>
          <ListItem
            className={classes.listItem}
            button 
            selected={this.state.selectedIndex === 4}
            onClick={event => this.handleListItemClick(event, 4)}
          >
            <ListItemIcon className={classes.icon}>
              <Icon>people</Icon>
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }}  primary="Menu1" />
          </ListItem>
          <ListItem
            className={classes.listItem}
            button 
            selected={this.state.selectedIndex === 5}
            onClick={event => this.handleListItemClick(event, 5)}
          >
            <ListItemIcon className={classes.icon}>
             <Icon>contacts</Icon>
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }}  primary="Menu2" />
          </ListItem>
        </List>
      </div>
    )

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar)}
          >
            <Toolbar className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <Icon>menu</Icon>
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.title}>
                Cognitive Insights
              </Typography>
              <TextField
                id="with-placeholder"
                placeholder="Search Here..."
                className={classes.textField}
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton color="inherit">
                      <Icon>search</Icon>
                    </IconButton>
                  </InputAdornment>,
                  style: {
                    color: 'white',
                    borderBottom:'1px solid white'
                  }
                }}
              />
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <Icon>notification_important</Icon>
                </Badge>
              </IconButton>
              {auth && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                <Icon>account_circle</Icon>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  <MenuItem onClick={this.handleClose}>Settings</MenuItem>
                  <MenuItem onClick={this.logOut}>Logout</MenuItem>
                </Menu>
              </div>
            )}
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            {
              (this.props.location.pathname === '/' || this.props.location.pathname === '/home' || this.props.location.pathname === '/dashboard')?
                <Dashboard />
              :(this.props.location.pathname === '/mapping')?
                <Mapping />
              :(this.props.location.pathname === '/artifacts')?
                <Artifacts />
              :(this.props.location.pathname === '/new_obligation')?
                <NewObligation />
              :(this.props.location.pathname === '/reports')?
                <Reports />
              :''
            }
          </main>
        </div>
      </React.Fragment>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(Header)