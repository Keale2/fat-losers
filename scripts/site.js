// Main JS should go here!
// Include scripts using Browserify by doing:
// var $ = require('jquery');

const Parse = require('parse');
const React = require('react');
const ReactDOM = require('react-dom');

Parse.initialize("S3nwK9b74nhUCgAkV2KtF20g1ACzW4g9JtHq5orY", "KpxqKfYnB21If1GWKLEyd1ZpqwAB3Owl1QDsfxPD");

class Login extends React.Component {
	login(e) {
		e.preventDefault();
		
		Parse.User.logIn(this.refs.username.value, this.refs.password.value, {
			// If the username and password matches
			success: function(user) {
				alert("WORKS");
				console.log(user);
			},
			// If there is an error
			error: function(user, error) {
				alert("BREAKSFOREVER");
				console.log(error);
			}
		});
	}
	
	render() {
		return (
			<form onSubmit={this.login.bind(this)}>
				<label>Username: <input type="text" ref="username" /></label>
				<label>Password: <input type="password" ref="password" /></label>
				<input type="submit" value="Login" />
			</form>
		);
	}
}

ReactDOM.render(<Login/>, document.querySelector('.app'));
