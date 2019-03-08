import React from "react";
import { withRouter } from "react-router";
import axios from "axios";

import * as p from "@cthit/react-digit-components";

class GammaIntegration extends React.Component {
    constructor(props) {
        super(props);
        if (props.location.search !== "") {
            const paramsResponse = new URLSearchParams(props.location.search);
            const code = paramsResponse.get("code");
            props.startedFetchingAccessToken();
            if (code) {
                axios
                    .post("http://localhost:8082/auth", {
                        code: code
                    })
                    .then(response => {
                        localStorage.token = response.data;
                        props.userUpdateMe().then(() => {
                            props.redirectTo("/");
                            props.finishedFetchingAccessToken();
                        });
                    })
                    .catch(error => {
                        props.finishedFetchingAccessToken();
                    });
            }
        }
    }

    render() {
        return null;
    }
}

export default withRouter(GammaIntegration);