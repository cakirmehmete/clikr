import React, { Component } from "react";
import { baseURL } from "../../constants/api";

class Login extends Component {
  componentDidMount() {
    var url_add_on_1 = "student/login?service=";
    var url_add_on_2 = "/student";
    var end_sub = 14;
    if (
      window.location.href.split("login-")[1].valueOf() === "prof".valueOf()
    ) {
      url_add_on_1 = "professor/login?service=";
      url_add_on_2 = "/professor";
      end_sub = 11;
    }

    window.location.replace(
      baseURL +
        url_add_on_1 +
        window.location.href.substring(
          0,
          window.location.href.length - end_sub
        ) +
        url_add_on_2
    );
  }

  render() {
    return <div>Logging In</div>;
  }
}

export default Login;
