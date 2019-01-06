'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var url = 'https://swapi.co/api/';
//This project uses facebook's React library
// the basic rules are you make components and you can nest them
//every component has state, and it may have props
//props are passed from parent to child e.g. <Display data={this.state.data}/>
//react uses jsx which is essentially just javascript and html mixed together
//when state changes the component re-renders to display the updated state

var Retrieve = function (_React$Component) {
  _inherits(Retrieve, _React$Component);

  function Retrieve(props) {
    _classCallCheck(this, Retrieve);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props)); //here we initialize state

    _this.state = { names: [] };
    return _this;
  }

  Retrieve.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    //this method runs before the render method, it retrieves the name for each category's items
    var holder = [];
    // this.props.data is an array holding url's
    this.props.data.map(function (c, i, a) {
      var p1 = new Promise(function (resolve, reject) {
        $.get(c, function (response, status) {
          if (status !== 'success') {
            reject();
          } else {
            resolve(response.name ? response.name : response.title); //here we grab the names for one category
          }
        });
      });
      p1.then(function (name) {
        _this2.setState({ names: _this2.state.names.concat(name) }); // after the promise resolves we set add the names to state
      }); // by using setState() we trigger a refresh of the Retrieve component
    });
  };

  Retrieve.prototype.render = function render() {
    //after componentWillMount completes then render runs
    console.log(this.props.category, this.props.data, 'Check this out');
    return React.createElement(
      'div',
      null,
      this.props.category,
      ': ',
      this.state.names.length > 0 ? this.state.names.join(', ') : 'None',
      ' '
    );
  };

  return Retrieve;
}(React.Component);

var Display = function (_React$Component2) {
  _inherits(Display, _React$Component2);

  //the data passed from parent to child is refered to as props
  // and accessed via this.props

  function Display(props) {
    _classCallCheck(this, Display);

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this, props)); //here we initialize state and props

    _this3.state = { names: {} };
    return _this3;
  }

  Display.prototype.render = function render() {
    var results = [];
    var attributes = [];

    if (this.props.data === null || undefined) {
      return null;
    } else if (this.props.data.count === 0) {
      return React.createElement(
        'div',
        { className: 'card text-center' },
        React.createElement(
          'h1',
          null,
          'Beep Boop'
        ),
        React.createElement(
          'h4',
          null,
          'Sorry, this search didn\'t yield any results, please check your spelling and try again!'
        ),
        React.createElement('hr', null),
        React.createElement(
          'h4',
          null,
          'Tips: Make sure you choose a search category!'
        ),
        React.createElement(
          'h4',
          null,
          'some names require hyphens e.g. x-wing'
        )
      );
    } else {
      //there are atleast one or more results
      for (var i = 0; i < this.props.data.results.length; i++) {
        //console.log(this.props.data.results,'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        attributes[i] = [];
        for (var x in this.props.data.results[i]) {
          var y = x.split(''); //uppercase category names
          y[0] = y[0].toUpperCase();
          y = y.join('');

          if (Array.isArray(this.props.data.results[i][x]) || x === 'homeworld') {

            attributes[i].push(React.createElement(Retrieve, { category: y,
              data: Array.isArray(this.props.data.results[i][x]) ? this.props.data.results[i][x] : [this.props.data.results[i][x]] }));
          } else if (x === 'created' || x === 'edited' || x === 'url') {
            //dont do anything I dont want to display these     
          } else {
              // let y = x.split('');
              // y[0]=y[0].toUpperCase();
              // y = y.join('');
              attributes[i].push(React.createElement(
                'span',
                null,
                y,
                ': ',
                this.props.data.results[i][x],
                ' '
              ));
            }
        }
        results.push(React.createElement(
          'div',
          { className: 'card' },
          React.createElement(
            'h1',
            { className: 'text-center' },
            this.props.data.results[i].name
          ),
          attributes[i]
        ));
      }
      return React.createElement(
        'div',
        null,
        results
      );
    }
  };

  return Display;
}(React.Component);

var Search = function (_React$Component3) {
  _inherits(Search, _React$Component3);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this4 = _possibleConstructorReturn(this, _React$Component3.call(this, props)); //here we initialize state

    _this4.state = { data: null };
    _this4.searchApi = _this4.searchApi.bind(_this4);
    return _this4;
  }

  Search.prototype.searchApi = function searchApi(Input) {
    var _this5 = this;

    Input.preventDefault();
    var category = undefined;
    Input.target.form[2].checked ? category = Input.target.form[2].value : null;
    Input.target.form[3].checked ? category = Input.target.form[3].value : null;
    Input.target.form[4].checked ? category = Input.target.form[4].value : null;
    Input.target.form[5].checked ? category = Input.target.form[5].value : null;
    Input.target.form[6].checked ? category = Input.target.form[6].value : null;
    Input.target.form[7].checked ? category = Input.target.form[7].value : null;
    //on search we determine the search category and set it to state as searchType
    this.setState({ searchType: category });
    var query = Input.target.form[0].value;
    //next we grab the form input and add it to a querystring below
    var queryString = url + category + '/?search=' + query;
    //finally we take the api response and stick it in the application state
    //by updating the state we trigger a refresh on line 145 rendering the
    //Display component shown above on line 55
    $.get(queryString, function (response) {
      _this5.setState({ data: response,
        error: null
      });
    }).fail(function (e) {
      console.log(e);
      if (e.status === 404) {
        _this5.setState({ error: 404 });
        //this shows the error i want to show on line 49
      }
    });
  };

  Search.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'col-xs-12', id: 'searchWrapper' },
      React.createElement(
        'form',
        { className: 'col-xs-12' },
        React.createElement(
          'div',
          { className: 'form-inline' },
          React.createElement('input', { className: 'form-control col-sm-8', placeholder: 'Luke Skywalker' }),
          React.createElement('input', { onClick: this.searchApi, type: 'submit', className: 'btn btn-default col-sm-4', value: 'Search' })
        ),
        React.createElement(
          'div',
          { className: 'col-xs-12 radioButtons text-center' },
          React.createElement(
            'span',
            { className: 'col-xs-1 col-sm-1' },
            React.createElement('input', { type: 'radio', name: 'searchType', value: 'planets' }),
            ' Planets'
          ),
          React.createElement(
            'span',
            { className: 'col-xs-1 col-sm-1' },
            React.createElement('input', { type: 'radio', name: 'searchType', value: 'starships' }),
            ' Starships'
          ),
          React.createElement(
            'span',
            { className: 'col-xs-1 col-sm-1' },
            React.createElement('input', { type: 'radio', name: 'searchType', value: 'vehicles' }),
            ' Vehicles'
          ),
          React.createElement(
            'span',
            { className: 'col-xs-1 col-sm-1' },
            React.createElement('input', { type: 'radio', name: 'searchType', value: 'people' }),
            ' People'
          ),
          React.createElement(
            'span',
            { className: 'col-xs-1 col-sm-1' },
            React.createElement('input', { type: 'radio', name: 'searchType', value: 'films' }),
            ' Films'
          ),
          React.createElement(
            'span',
            { className: 'col-xs-1 col-sm-1' },
            React.createElement('input', { type: 'radio', name: 'searchType', value: 'species' }),
            ' Species'
          )
        )
      ),
      React.createElement(
        'div',
        null,
        this.state.error === 404 ? React.createElement(Display, { data: { count: 0 } }) : null,
        this.state.searchType === (null || undefined) ? null : React.createElement(Display, { data: this.state.data })
        //if this.state.searchType is null then return null, otherwise render the Display component and pass this.state.data as this.props.data if theres an error show the error component

      )
    );
  };

  return Search;
}(React.Component);

var Home = function (_React$Component4) {
  _inherits(Home, _React$Component4);

  function Home() {
    _classCallCheck(this, Home);

    return _possibleConstructorReturn(this, _React$Component4.apply(this, arguments));
  }

  //this is just a wrapper component

  Home.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'container-fluid col-md-offset-3 col-md-6', id: 'wrapper' },
      React.createElement(
        'h1',
        { className: 'text-center' },
        'STAR SEARCH'
      ),
      React.createElement(Search, null)
    );
  };

  return Home;
}(React.Component);

//this is where react enters the webpage

ReactDOM.render(React.createElement(Home, null), document.getElementById('root'));