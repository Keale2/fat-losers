// Main JS should go here!
// Include scripts using Browserify by doing:
// var $ = require('jquery');

import React from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import ReactDOM from "react-dom";
import moment from "moment";
import {getWeeks} from "./util.js";
import _ from "lodash";

const ParseComponent = ParseReact.Component(React);

Parse.initialize("S3nwK9b74nhUCgAkV2KtF20g1ACzW4g9JtHq5orY", "KpxqKfYnB21If1GWKLEyd1ZpqwAB3Owl1QDsfxPD");

class Login extends React.Component {
	submit(e) {
		e.preventDefault();

		Parse.User.logIn(this.refs.username.value, this.refs.password.value, {
			// If the username and password matches
			success: function(user) {
				console.log(user);
			},
			// If there is an error
			error: function(user, error) {
				alert("ERR");
				console.log(error);
			}
		});
	}

	render() {
		return (
			<form onSubmit={this.submit.bind(this)}>
				<label>Username: <input type="text" ref="username" /></label>
				<label>Password: <input type="password" ref="password" /></label>
				<input type="submit" value="Login" />
			</form>
		);
	}
}

class Weights extends ParseComponent {
    observe() {
        let q = new Parse.Query("Weight");
        q.equalTo("user", this.props.user);
        q.lessThanOrEqualTo("date", this.props.weeks[this.props.weeks.length - 1].toDate());
        q.greaterThanOrEqualTo("date", this.props.weeks[0].toDate());

        return {
            values: q
        };
    }

    render() {
        let {weeks, user} = this.props;
        let userWeeks = weeks.map((week) => {
            var parseObj = _.find(this.data.values, function(val) {
                return week.isSame(val.date, 'week');
            });

            return {
                date: week,
                value: (parseObj && parseObj.amount) || 0
            };
        });

        return (
            <tr>
                <th scope="row">{user.username}</th>
                {userWeeks.map((week) => {
                    return <td><input value={week.value}/></td>
                })}
            </tr>
        )
    }
}



class App extends ParseComponent {
    constructor() {
        super();
        this.state = {
            currentWeek: moment().startOf('isoweek')
        };
    }

    observe() {
        return {
            users: (new Parse.Query('User'))
        };
    }

    logout() {
        Parse.User.logOut();
    }

    prevWeek() {
        this.setState({
            weeks: this.state.currentWeek.subtract(1, 'week')
        });
    }

    nextWeek() {
        this.setState({
            weekOffset: this.state.currentWeek.add(1, 'week')
        });
    }

    render() {
        let weeks = getWeeks({ start: this.state.currentWeek });
        return (
            <div>
                <button onClick={this.logout.bind(this)}>Logout</button>
                <button onClick={this.prevWeek.bind(this)}>Previous</button>
                <button onClick={this.nextWeek.bind(this)}>Next</button>

                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            {weeks.map((week) => <th scope="col">{week.format("M/D")}</th>)}
                        </tr>
                        {this.data.users.map((user) => {
                            return <Weights user={user} weeks={weeks} />
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

class Root extends ParseComponent {
    observe() {
        return {
            user: ParseReact.currentUser
        };
    }

    render() {
        if(this.data.user) {
            return <App />
        } else {
            return <Login />
        }
    }
}

ReactDOM.render(<Root/>, document.querySelector('.app'));
