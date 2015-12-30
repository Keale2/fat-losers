// Main JS should go here!
// Include scripts using Browserify by doing:
// var $ = require('jquery');

import React from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import ReactDOM from "react-dom";
import moment from "moment";

const ParseComponent = ParseReact.Component(React);

Parse.initialize("S3nwK9b74nhUCgAkV2KtF20g1ACzW4g9JtHq5orY", "KpxqKfYnB21If1GWKLEyd1ZpqwAB3Owl1QDsfxPD");

const MonthForUser = ({month}) => {
    console.log(month);
    return (
        <h1>{month}</h1>
    )
}

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

class App extends ParseComponent {
    observe() {
        return {
            users: (new Parse.Query('User'))
        };
    }

    logout() {
        Parse.User.logOut();
    }

    render() {
        return (
            <div>
                <button onClick={this.logout.bind(this)}>Logout</button>
                {this.data.users.map((user) => {
                    return (
                        <div>
                            <h1>{user.username}</h1>
                            <MonthForUser month={Date.now()} />
                        </div>
                    )
                })}
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
