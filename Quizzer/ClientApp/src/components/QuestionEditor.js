import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Spinner, Modal, ModalBody, ModalFooter, Button, Label} from 'reactstrap';
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
        let content = this.state.loading ? <div className="text-center mt-5"><h3 className="mb-5">Loading Editor</h3><Spinner color="primary" /></div>
        :
        this.renderForm();
        return (    
            <div>
                {content}
            </div>       
        );
    }

    renderForm(){
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
                                <ModalBody>       
                                <div> 
                                    <div className="form-group">
                                        <Label htmlFor="question.text">Question</Label>
                                        <Field name="question.text" component="textarea" rows={2} col={25} className={'form-control ' + (props.errors.question && props.touched.question ? ' is-invalid' : '')} />
                                        <ErrorMessage name="question.text" component="div" className="invalid-feedback" />
                                    </div>
                                        <div className="form-group">
                                            <Label htmlFor="answer0.text" className="mr-1">Answer 1</Label>
                                            <label>
                                                <Field type="radio" name="correctId" value={props.values.answer0.id}/>
                                            </label>
                                            <Field name="answer0.text" type="text" className={'form-control' + (props.errors.answer0 && props.touched.answer0 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer0" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <Label htmlFor="answer1.text" className="mr-1">Answer 2</Label>
                                            <label>
                                                <Field type="radio" name="correctId" value={props.values.answer1.id}/>
                                            </label>
                                            <Field name="answer1.text" type="text" className={'form-control' + (props.errors.answer1 && props.touched.answer1 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer1" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <Label htmlFor="answer2.text" className="mr-1">Answer 3</Label>
                                            <label>
                                                <Field type="radio" name="correctId" value={props.values.answer2.id}/>
                                            </label>
                                            <Field name="answer2.text" type="text" className={'form-control' + (props.errors.answer2 && props.touched.answer2 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer2" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <Label htmlFor="answer3.text" className="mr-1">Answer 4</Label>
                                            <label>
                                                <Field type="radio" name="correctId" value={props.values.answer3.id}/>
                                            </label>
                                            <Field name="answer3.text" type="text" className={'form-control' + (props.errors.answer3 && props.touched.answer3 ? ' is-invalid' : '')} />
                                            <ErrorMessage name="answer3" component="div" className="invalid-feedback" />
                                        </div>
                                </div>
                                </ModalBody>
                                <ModalFooter>
                                <span className="align-self-start mr-auto">Check radiobutton next to correct answer.</span>
                                    <Button type="submit" color="primary" disabled={props.isSubmitting}>Submit Edit</Button>{' '}
                                    <Button color="secondary" onClick={() => this.state.unmountEditor()}>Cancel</Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Modal>         
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

        return fetch('/api/questions/' + question.id, fetchConfig)
        .then(handleResponse);
    }
}

