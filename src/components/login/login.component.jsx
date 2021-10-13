import React, {useState} from 'react';
import './login.styles.css';

const Login = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    function validateForm() {
      return username.length > 0 && password.length > 0;
    }
  
    function handleSubmit(event) {
     props.doLogin(username,password);
    }

return (
    <div className="login">
       <h2>Login</h2>
       <div className="input-field">
           <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username"/>
       </div>
       <div className="input-field">
           <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"/>
       </div>
       <input type="button" value="LogIn" onClick={handleSubmit} disabled={!validateForm()}></input>
    </div>
    )
  }

  export default Login;
