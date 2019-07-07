import React from "react";
import {
    DigitTranslations,
    DigitLayout,
    DigitForm,
    DigitDesign,
    DigitTextField,
    DigitFormField,
    DigitButton, } from "@cthit/react-digit-components";
import translations from "./ResetPasswordInitalize.screen.translations";
import * as yup from "yup";

class ResetPasswordInitalize extends React.Component {
    componentDidMount() {
        const { gammaLoadingFinished } = this.props;
        gammaLoadingFinished();
    }

    render() {
        const { sendPasswordReset, redirectTo, toastOpen } = this.props;
        return (
            <div>
                <DigitTranslations
                    translations={translations}
                    render={text => (
                        <DigitLayout.MarginTop>
                            <DigitLayout.Center>
                                <DigitForm
                                    validationSchema={yup.object().shape({
                                        cid: yup
                                            .string()
                                            .required(text.FieldRequired)
                                    })}
                                    initialValues={{ cid: "" }}
                                    onSubmit={(values, actions) => {
                                        sendPasswordReset(values.cid)
                                            .then(response => {
                                                actions.resetForm();
                                                actions.setSubmitting(false);
                                                redirectTo(
                                                    "/reset-password/finish"
                                                );
                                            })
                                            .catch(error => {
                                                toastOpen({
                                                    text: text.SomethingWentWrong,
                                                    duration: 5000,
                                                })
                                            })
                                    }}
                                    render={({errors, touched}) => (
                                        <DigitDesign.Card
                                            absWidth="300px"
                                            absHeight="300px"
                                            hasSubTitle
                                        >
                                            <DigitDesign.CardTitle
                                                text={text.PasswordResetTitle}
                                            />
                                            <DigitDesign.CardSubTitle
                                                text={text.ResetDescription}
                                            />
                                            <DigitDesign.CardBody>
                                                <DigitLayout.Center>
                                                    <DigitFormField
                                                        name="cid"
                                                        component={DigitTextField}
                                                        componentProps={{
                                                            upperLabel: text.Cid,
                                                            filled: false,
                                                        }}
                                                        />
                                                </DigitLayout.Center>
                                            </DigitDesign.CardBody>
                                            <DigitDesign.CardButtons
                                                reverseDirection
                                            >
                                                <DigitButton
                                                    text={text.ResetPassword}
                                                    primary
                                                    raised
                                                    submit
                                                />
                                            </DigitDesign.CardButtons>
                                        </DigitDesign.Card>

                                    )}
                                />
                            </DigitLayout.Center>
                        </DigitLayout.MarginTop>
                    )}
                />
            </div>
        );
    }
}

export default ResetPasswordInitalize;