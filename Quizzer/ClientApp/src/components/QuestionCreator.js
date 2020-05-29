import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Modal, ModalBody, ModalFooter, Button, Label} from 'reactstrap';
import {authenticationService} from "../services/helpers";
import {handleResponse} from "../services/handle-response";

export class QuestionCreator extends Component {
    static displayName = QuestionCreator.name;

    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            correctId : "",
            updateParentState : null,
            unmountCreator : null
         };
         this.renderForm = this.renderForm.bind(this);
    }

    componentDidMount(){
        this.setState(
            {
                updateParentState : this.props.updateParentState,
                unmountCreator : this.props.unmountCreator
            });
    }

    render() {
        let content = this.renderForm();
        return (    
            <div>
                {content}
            </div>       
        );
    }

    renderForm(){
        console.log("QuestionCreator");
        return(
        <div>
            <Modal isOpen={true} backdrop="static" className="modal-lg">
                <div>
                    <Formik
                        enableReinitialize = {
                            true
                        }
                        
                        initialValues=
                        {
                            {
                                question : '',
                                answer0 : '',
                                answer1 : '',
                                answer2 : '',
                                answer3 : '',
                                correctId : '',
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
                            this.createQuestion(question, answer0, answer1, answer2, answer3, correctId)
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
                                <ModalBody>       
                                <div> 
                                    <div className="form-group">
                                        <Label htmlFor="question">Question</Label>
                                        <Field name="question" component="textarea" rows={2} col={25} className={'form-control ' + (props.errors.question && props.touched.question ? ' is-invalid' : '')} />
                                        <ErrorMessage name="question" component="div" className="invalid-feedback" />
                                    </div>
                                        <div className="form-group">
                                            <Label htmlFor="answer0" className="mr-1">Answer 1</Label>
                                            <label>
                                                <Field type="radio" name="correctId" value={'0'}/>
                                            </label>
                                            <Field name="answer0" type="text" className={'form-control' + (props.errors.answer0 && props.touched.answer0 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer0" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <Label htmlFor="answer1" className="mr-1">Answer 2</Label>
                                            <label>
                                                <Field type="radio" name="correctId" value={'1'}/>
                                            </label>
                                            <Field name="answer1" type="text" className={'form-control' + (props.errors.answer1 && props.touched.answer1 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer1" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <Label htmlFor="answer2" className="mr-1">Answer 3</Label>
                                            <label>
                                                <Field type="radio" name="correctId" value={'2'}/>
                                            </label>
                                            <Field name="answer2" type="text" className={'form-control' + (props.errors.answer2 && props.touched.answer2 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer2" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <Label htmlFor="answer3" className="mr-1">Answer 4</Label>
                                            <label>
                                                <Field type="radio" name="correctId" value={'3'}/>
                                            </label>
                                            <Field name="answer3" type="text" className={'form-control' + (props.errors.answer3 && props.touched.answer3 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer3" component="div" className="invalid-feedback" />
                                        </div>
                                </div>
                                </ModalBody>
                                <ModalFooter>
                                <span className="align-self-start mr-auto">Check radiobutton next to correct answer.</span>
                                    <Button type="submit" color="primary" disabled={props.isSubmitting}>Submit Question</Button>{' '}
                                    <Button color="secondary" onClick={() => this.state.unmountCreator()}>Cancel</Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Modal>         
    </div>);
    }

    createQuestion(question, answer0, answer1, answer2, answer3, correctId){
        this.state.updateParentState(true);
        let XSRF = authenticationService.getCookie('XSRF-REQUEST-TOKEN');
        let fetchConfig =
            {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': XSRF
                },
                credentials : 'include',
                body : JSON.stringify(
                    {
                        questionText : question,
                        answers : [answer0, answer1, answer2, answer3],
                        correctId : correctId
                    })
            };

        return fetch('/api/questions', fetchConfig)
        .then(handleResponse);
    }
}

