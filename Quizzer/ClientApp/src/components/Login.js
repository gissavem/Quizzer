import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {handleResponse} from "../services/handle-response";
import {authenticationService} from "../services/helpers";
import {Link} from 'react-router-dom';

export class Login extends Component {
    static displayName = Login.name;

    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
            <div className="text-center mt-5 mx-auto">
                <Formik
                    initialValues=
                        {
                            {
                                email : '',
                                password :''
                            }
                        }
                    validationSchema=
                        {
                            Yup.object().shape(
                                {
                                    email : Yup.string().email('Invalid Email').required('Email required')
                                })
                        }
                    onSubmit={({email, password},{ setStatus, setSubmitting }) =>
                    {
                        setStatus();
                        authenticationService.login(email, password)
                            .then( user=>{
                                const { from } = this.props.location.state || { from: { pathname: "/" } };
                                this.props.history.push(from);
                            }
                            )
                            .catch((error) =>
                            {
                                setSubmitting(false);
                                setStatus(error.description);
                            });
                    }}>
                    {props => (
                        <Form>
                            <div className="form-group w-50 mx-auto">
                                <label htmlFor="email">Email</label>
                                <Field name="email" type="text" className={'form-control' + (props.errors.email && props.touched.email ? ' is-invalid' : '')} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group w-50 mx-auto">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" className={'form-control' + (props.errors.password && props.touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group w-50 mx-auto">
                                <button type="submit" className="btn btn-info w-50 mt-5" disabled={props.isSubmitting}>Login</button>
                                {props.isSubmitting &&
                                <img alt="loading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </div>
                            {props.status &&
                            <div className={'alert alert-danger'}>{props.status}</div>
                            }
                        </Form>
                    )}
                </Formik>
                <Link to={"/Register"}>Don't have an account?{<br></br>}Register one here.</Link>
            </div>
        );
    }
}

