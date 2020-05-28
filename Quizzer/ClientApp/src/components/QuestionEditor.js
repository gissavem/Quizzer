import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {Jumbotron, Spinner} from 'reactstrap';
import {authenticationService} from "../services/helpers";
import {handleResponse} from "../services/handle-response";

export class QuestionEditor extends Component {
    static displayName = QuestionEditor.name;

    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            question : "",
            correctId : "",
            updateParentState : null,
            unmountEditor : null
         };
         this.renderForm = this.renderForm.bind(this);
    }

    componentDidMount(){
        this.setState(
            {
                question : this.props.question, 
                updateParentState : this.props.updateParentState,
                unmountEditor : this.props.unmountEditor
            }, () => {
            this.state.question.answers.forEach(answer => {
                if(answer.isCorrect){
                    this.setState({loading : false, correctId : answer.id})
                }
            });
        });
    }

    render() {
        let content = this.state.loading ? <div className="text-center mt-5"><h3 className="mb-5">Loading Questions</h3><Spinner color="primary" /></div>
        :
        this.renderForm();
        return (    
            <div>
                {content}
            </div>       
        );
    }

    renderForm(){
        return(<div>
            <div className="text-center mt-5 mx-auto">
            <Formik
                enableReinitialize = {
                    true
                }
                
                initialValues=
                    {
                        {
                            question :
                            {
                                text : this.state.question.text,
                                id : this.state.question.id
                            },
                            answer0 : this.state.question.answers[0],
                            answer1 : this.state.question.answers[1],
                            answer2 : this.state.question.answers[2],
                            answer3 : this.state.question.answers[3],
                            correctId : this.state.correctId
                        }
                    }
                validationSchema=
                    {
                        Yup.object().shape(
                            {
                                question : Yup.string().required('Question required'),
                                answer0 : Yup.string().required('All answers required'),
                                answer1 : Yup.string().required('All answers required'),
                                answer2 : Yup.string().required('All answers required'),
                                answer3 : Yup.string().required('All answers required')
                            })
                    }
                onSubmit={({question, answer0, answer1, answer2, answer3, correctId},{ setStatus, setSubmitting }) =>
                {
                    setStatus();
                    this.updateQuestion(question, answer0, answer1, answer2, answer3, correctId)
                        .then(user =>
                            {
                                this.state.updateParentState(false);
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
                        <button type="button" className="close" aria-label="Close" onClick={() => this.state.unmountEditor()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div>             
                            <Jumbotron>
                                <div className="form-group w-50 mx-auto">
                                    <Field name="question.text" type="text" className={'form-control' + (props.errors.question && props.touched.question ? ' is-invalid' : '')} />
                                    <ErrorMessage name="question.text" component="div" className="invalid-feedback" />
                                </div>
                            </Jumbotron>
                            <div className="card-deck">
                                <div className="card bg-info shadow rounded zoom">
                                    <div className="card-body text-center">
                                        <div className="form-group w-50 mx-auto">
                                            <Field name="answer0.text" type="text" className={'form-control' + (props.errors.answer0 && props.touched.answer0 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer0" component="div" className="invalid-feedback" />
                                        </div>
                                        <label>
                                            <Field type="radio" name="correctId" value={props.values.answer0.id}/>
                                        </label>
                                    </div>
                                </div>
                                <div className="card bg-info shadow rounded zoom">
                                    <div className="card-body text-center">
                                        <div className="form-group w-50 mx-auto">
                                            <Field name="answer1.text" type="text" className={'form-control' + (props.errors.answer1 && props.touched.answer1 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer1" component="div" className="invalid-feedback" />
                                        </div>
                                        <label>
                                            <Field type="radio" name="correctId" value={props.values.answer1.id}/>
                                        </label>
                                    </div>
                                </div>
                                <div className="card bg-info shadow rounded zoom">
                                    <div className="card-body text-center">
                                        <div className="form-group w-50 mx-auto">
                                            <Field name="answer2.text" type="text" className={'form-control' + (props.errors.answer2 && props.touched.answer2 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer2" component="div" className="invalid-feedback" />
                                        </div>
                                        <label>
                                            <Field type="radio" name="correctId" value={props.values.answer2.id}/>
                                        </label>
                                    </div>
                                </div>
                                <div className="card bg-info shadow rounded zoom">
                                    <div className="card-body text-center">
                                        <div className="form-group w-50 mx-auto">
                                            <Field name="answer3.text" type="textarea" className={'form-control' + (props.errors.answer3 && props.touched.answer3 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer3" component="div" className="invalid-feedback" />
                                        </div>
                                        <label>
                                            <Field type="radio" name="correctId" value={props.values.answer3.id}/>
                                        </label>
                                    </div>
                                </div>
                            </div>                       
                            <div className="form-group w-50 mx-auto">
                                <button type="submit" className="btn btn-info w-50 mt-5" disabled={props.isSubmitting}>Save edit</button>
                                {props.isSubmitting &&
                                <img alt="loading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    </div>);
    }

    updateQuestion(question, answer0, answer1, answer2, answer3, correctId){
        this.state.updateParentState(true);
        let XSRF = authenticationService.getCookie('XSRF-REQUEST-TOKEN');
        let fetchConfig =
            {
                method : 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': XSRF
                },
                credentials : 'include',
                body : JSON.stringify(
                    {
                        questionId : question.id,
                        questionText : question.text,
                        answers : [answer0, answer1, answer2, answer3],
                        correctId : correctId
                    })
            };

        return fetch('/quiz/questions/' + question.id, fetchConfig)
        .then(handleResponse);
    }
}

