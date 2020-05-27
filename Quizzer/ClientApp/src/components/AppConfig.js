import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {authenticationService} from "../services/helpers";
import {Button, Spinner, Table} from "reactstrap";

export class AppConfig extends Component {
    static displayName = AppConfig.name;
    
    constructor(props) {
        super(props);
        this.state = 
            {
                loading : true,
                questions : []
            };  
            this.loadQuestions = this.loadQuestions.bind(this);
            this.renderQuestions = this.renderQuestions.bind(this);   
    }

    componentDidMount() {
        this.loadQuestions();
    }
    
    loadQuestions() {
        let XSRF = authenticationService.getCookie('XSRF-REQUEST-TOKEN');
        let fetchConfig =
            {
                method : 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': XSRF
                },
                credentials : 'include'
            };
        
        fetch('/quiz/questions', fetchConfig)
            .then(response => response.json())
            .then((jsondata) => 
            {
                this.setState({questions : jsondata, loading : false})
            })        
    }

    renderQuestions(){
        return(
            <div>
                <Table>
                    <thead>
                    <tr>
                        {/*<th>#</th>*/}
                        <th>Id</th>
                        <th>Question</th>
                        <th>Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.questions.map(question =>
                    <tr>
                        {/*<th scope="row">{index + 1}</th>*/}
                        <td>{question.id}</td>
                        <td>{question.text}</td>                      
                        <td className="text-center">
                            <button className="border-0 bg-transparent" onClick={() => this.removeQuestion(question.id)}>
                                <i className={`fas fa-trash`} />
                            </button>
                        </td>
                    </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        );
    }
    
    removeQuestion(questionId){
        this.setState({loading : true});
        let XSRF = authenticationService.getCookie('XSRF-REQUEST-TOKEN');
        let fetchConfig =
            {
                method : 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': XSRF
                },
                credentials : 'include'
            };
        
        fetch('/quiz/questions/' + questionId, fetchConfig)
        .then((response) => {
            if(response.ok){
                this.loadQuestions();
                this.setState({loading : false})
            }
        });
    }

    render() {
        let content = "";
        
        if(this.state.loading){
            content = <div className="text-center mt-5"><h3 className="mb-5">Loading Questions</h3><Spinner color="primary" /></div>;
        }
        else{
            content = this.renderQuestions();
        }
        return content;
    }
}

