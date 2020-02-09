import {
    DigitRedirectActions,
    DigitTranslationsActions
} from "@cthit/react-digit-components";
import axios from "axios";
import token from "../../../common/utils/retrievers/token.retrieve";
import {
    USER_NOT_LOGGED_IN,
    USER_UPDATED_FAILED,
    USER_UPDATED_SUCCESSFULLY
} from "./UserInformation.element.actions";
import { ENGLISH_LANGUAGE } from "../../../api/utils/commonProps";
import { getBackendUrl } from "../../../common/utils/configs/envVariablesLoader";

export function userUpdateMe() {
    if (token() == null) {
        return {
            type: USER_NOT_LOGGED_IN,
            error: false
        };
    } else {
        return dispatch => {
            return new Promise((resolve, reject) => {
                axios
                    .get(
                        getBackendUrl() + "/users/me",
                        {
                            headers: {
                                Authorization: "Bearer " + token()
                            }
                        }
                    )
                    .then(response => {
                        resolve(response);

                        dispatch(userUpdatedSuccessfully(response.data));

                        const lang = response.data.language;

                        dispatch(
                            DigitTranslationsActions.setActiveLanguage(
                                lang == null ? ENGLISH_LANGUAGE : lang
                            )
                        );
                    })
                    .catch(error => {
                        reject();
                        dispatch(userUpdatedFailed(error));
                        const statusCode =
                            error.response == null
                                ? -1
                                : error.response.data.status;
                        switch (statusCode) {
                            case 403:
                                dispatch(userLogout());
                                break;
                            default:
                                //TODO DISPATCH REDIRECT TO ERROR PAGE
                                break;
                        }
                    });
            });
        };
    }
}

export function userLogout() {
    return dispatch => {
        delete localStorage.token;
        delete sessionStorage.token;
        dispatch(
            DigitRedirectActions.digitRedirectTo(
                getBackendUrl() + "/logout",
                true
            )
        );
    };
}

export function userUpdatedSuccessfully(data) {
    return {
        type: USER_UPDATED_SUCCESSFULLY,
        payload: {
            user: data
        },
        error: false
    };
}

export function userUpdatedFailed(errorData) {
    return {
        type: USER_UPDATED_FAILED,
        error: true,
        payload: {
            error: errorData
        }
    };
}
