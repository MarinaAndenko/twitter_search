import React from "react";
import PropTypes from "prop-types";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import TextField from 'material-ui/TextField';
import {orange500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

const enterKey = 13;
const mixed = 'mixed';
const recent = 'recent';
const popular = 'popular';
const materialStyles = {
  textField: {
    color: orange500,
  },
};

class Tweets extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      results: this.props.results,
      hashtags: this.props.hashtags,
      resultType: null,
      query: '',
    };
  }

  decorateUrl = (query, resultType) => {
    let url = new URL(window.location.href.split('?')[0]);
    let params = new URLSearchParams(url.search.slice(1));

    if(query) params.set('query', query);
    if(resultType) params.set('result_type', resultType);

    history.pushState(this.state, document.title, url + '?' + params);
  }

  fetchData = (resultType = this.state.resultType, query = this.state.query) => {
    this.decorateUrl(query, resultType);

    $.get( '/search.json', { query: query, result_type: resultType },
    function(data) {
      this.setState({
        results: data.results,
        hashtags: data.hashtags,
      })
    }.bind(this)).fail(function() {});
  }

  handleChange = (e, value) => {
    this.setState({ query: value });
  }

  handleKeyDown = (e) => {
    if (e.keyCode === enterKey) this.fetchData();
  }

  handleClick = () => {
    this.fetchData();
  }

  handleTypeClick =(e) => {
    this.setState({ resultType: e.target.textContent });
    this.fetchData(e.target.textContent);
  }

  setHashtags = () => {
    let i = 0, hashtagsArr = [], hashtagsSet = null;
    let hashtags_hash = this.state.hashtags;

    Object.keys(hashtags_hash).map((key, index) => {
      hashtagsArr.push(
        <Badge badgeContent={hashtags_hash[key]} primary={true} key={'hashtag' + i}>
          <div className='hashtag-div'>
            #{ key }
          </div>
        </Badge>
      );
      i++;
    });

    if(hashtagsArr && hashtagsArr.length)
      hashtagsSet = <Paper className='hashtags-set' zDepth={2}>{hashtagsArr}</Paper>;

    return hashtagsSet;
  }

  setResults = () => {
    let i = 0, resultsArr = [];

    this.state.results.map((result) => {
      let decoratedText = result.text.replace(/#hacker/ig, "<b>#hacker</b>");
      resultsArr.push(
        <div key={'result' + i}>
          <div className='result-div'>
            <b>@{ result.user_name }</b> <span dangerouslySetInnerHTML={{ __html: decoratedText }}></span>
          </div>
          <Divider />
        </div>
      );
      i++;
    });

    return resultsArr;
  }

  render () {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title="Twitter Search" showMenuIconButton={false} />
          <div className='search-div'>
            <div className='text-field-div'>
              <TextField 
                hintText="What you want to know?.." hintStyle={materialStyles.textField}
                fullWidth={true} onChange={this.handleChange} onKeyDown={this.handleKeyDown}
              />
            </div>
            <div className='raised-button-div'>
              <RaisedButton label="Search" primary={true} className='raised-button' onClick={this.handleClick}/>
            </div>
            <div className='text-field-div'>
              <FlatButton label={mixed} onClick={this.handleTypeClick}/>
              <FlatButton label={recent} primary={true} onClick={this.handleTypeClick}/>
              <FlatButton label={popular} secondary={true} onClick={this.handleTypeClick}/>
            </div>
          </div>
          <div className='main-div'>
            { this.setHashtags() }
            { this.setResults() }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Tweets.propTypes = {
  results: PropTypes.array,
  hashtags: PropTypes.object
};

export default Tweets
