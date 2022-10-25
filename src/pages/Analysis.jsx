import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Analysis() {

    const { id } = useParams();
    const  [isLoading, setLoading] = useState(true);
    const [loadedMissedQuestions, setLoadedMissedQuestions] = useState(false);
    const [printState, setPrintState] = useState('none');
    const [responses, setResponses] = useState([]);
    const [responseData, setResponseData] = useState({});
    const [questions, setQuestions] = useState([]);
    const [analysisTable, setAnalysisTable] = useState([]);
    const [missedQuestions, setMissedQuestions] = useState([]);
    const [metaData, setMetaData] = useState({});
    const [datacollection, setDatacollection] = useState({});
    const [data, updateData] = useState({
        shutdownDialogue: false,
        pageLoading: true,
        pageLoadingMessage: 'Please standby while we analyze the quiz...',
        moment: moment,
        sermon: {},
        summaryHeaders: [
            { text: "Name", accessor: "name" },
            { text: "Raw Score", accessor: "score" },
            { text: "Percentage", accessor: "percentage" },
            { text: "Rank", accessor: "rank" }
        ],
        headers: [
            { text: "Q-No", accessor: "questionNumber" },
            {
                text: "Answer",
                align: "start",
                accessor: "answer"
            },
            { text: "A", accessor: "A" },
            { text: "B", accessor: "B" },
            { text: "C", accessor: "C" },
            { text: "D", accessor: "D" },
            { text: "U", accessor: "unAnswered" },
            { text: "Total", accessor: "total" },
            { text: "Non Distractors", accessor: "nonDistractors" },
            { text: "Item Difficulty (%)", accessor: "itemDifficulty" },
            { text: "Discrimination", accessor: "discrimination" }
        ]
    })
    
    useEffect(_ => {
        ;(async _ => {
            // console.log(context)
            try {
                // Load analysis
                // const url = 'http://localhost:5000';
                const url = process.env.REACT_APP_API_URL;
                const res = await axios.get(`${url}/api/scribbleworks-demoresponses/${id}`);
                const result = {...res.data};
                // const result  = await (await fetch(`${url}/api/scribbleworks-demoresponses/${id}`)).json();
                // console.log(result)
                setResponseData(result)
                setMetaData(result.metaData)
                let dataResponses = result.responses;
                let dataMeta = result.metaData;
                let dataQues = result.questions;

                // Prepare answer analysis table
                let questionNumberOffsetCounter = 1;
                let quesArray = [];
                let analysisTb = [];
                let missedQues =  [];
                for (let i = 0; i < dataQues.length; i++) {
                    const question = dataQues[i];
                    if (question.type === "MULTIPLE_CHOICE") {
                        let questionAnalysisDataPoint = {
                            questionNumber: questionNumberOffsetCounter++,
                            A: question.respFreq.A || 0,
                            B: question.respFreq.B || 0,
                            C: question.respFreq.C || 0,
                            D: question.respFreq.D || 0,
                            answer: question.answer,
                            respFreqString: question.respFreqString,
                            nonDistractors: getNonDistractors(question.respFreqString),
                            unAnswered:
                            dataResponses.length - getUnansweredTotal(question.respFreq), // ToDo: This should be sum of ABCDU and should equal all submissions
                            total: getUnansweredTotal(question.respFreq)+(dataResponses.length - getUnansweredTotal(question.respFreq)), // adding the total computation to the fxn for calculating U
                            itemDifficulty: getItemDifficulty(
                                question.answer,
                                question.respFreq,
                                dataResponses.length
                            ),
                            discrimination: getDiscrimination(
                                getItemDifficulty(
                                    question.answer,
                                    question.respFreq,
                                    dataResponses.length
                                )
                            )
                        };
                        let quesObj = { ...dataQues[i] };
                        quesObj.respFreqValue = (100 - questionAnalysisDataPoint.itemDifficulty).toFixed(2);
                        quesObj.questionNumber = questionAnalysisDataPoint.questionNumber;
                        // console.log(quesObj)
                        quesArray.push(quesObj);
                        analysisTb.push(questionAnalysisDataPoint)
                        setQuestions(quesArray)
                        setAnalysisTable(analysisTb)
                        // Get frequently missed questions
                        if (quesObj.respFreqValue > 50)
                            missedQues.push(quesObj);
                    }
                }

                setMissedQuestions(missedQues)

                // Prepare graph
                setDatacollection({
                    labels: getQuestionNumberGraphLabels(),
                    datasets: [
                        {
                            label: "Graph of Correct Responses",
                            data: getCorrectResponsesData(),
                            fill: false,
                            borderColor: "#ff3f5f",
                            tension: 0.5
                        }
                    ]
                })

                // Get student percentages
                let resp = [ ...dataResponses ];
                resp.forEach((response, index) => {
                    if (response.score) {
                        resp[index].percentage = Math.round(
                            (Number(response.score) / Number(dataMeta.totalQuizScore)) * 100
                        );
                    } else {
                        resp[index].percentage = 'N/A';
                    }
                })
                // Reorder the ranks of students
                let ranks = [1];
                let pcts = [...dataResponses].map(res => res.percentage);
                let pctRank = 1;
                for (let i = 1; i < pcts.length; i++) {
                    if (pcts[i - 1] == pcts[i])
                        pctRank = pctRank;
                    else
                        pctRank = i + 1;
                    ranks.push(pctRank)
                }
                let respRankOrdered = resp.map((res, index) => {
                    return { ...res, rank: ranks[index] }
                })
                setResponses(respRankOrdered)
                // console.log(respRankOrdered, pcts, ranks)
                setLoading(false)
            } catch(err) {
                console.log('Something went wrong while fetching data:', err.message)
            }
        })()
    }, [])

    useEffect(_ => {
        setLoadedMissedQuestions(true)
        // console.log(missedQuestions)
        return ()  => setLoadedMissedQuestions(false)
    }, [missedQuestions])

    const FrequentlyMissed = ({ missed = [] }) => {
        return (
            <div className="sect-title">
                <h1>Freqently Missed Questions</h1>
                {
                    missed.map((ques, index) => {
                        return (
                            <div className="missed-ques" key={`ques${index}`}>
                                <p className="ques">
                                    {`Q${ques.questionNumber}) ${ques.title}`}
                                </p>
                                <p className="pct bold">
                                    {ques.respFreqValue}%
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        )
    };

    const getQuestionNumberGraphLabels = _ => {
        let questionCounter = 1;
        let output = [];
        questions.forEach((question, index) => {
            if (question.type === "MULTIPLE_CHOICE") {
                output.push("Q" + questionCounter);
                questionCounter++;
            }
        });
        return output;
    };

    const getCorrectResponsesData = _ => {
        let output = [];
        questions.forEach((question, index) => {
            if (question.type === "MULTIPLE_CHOICE") {
                if (question.respFreq[String(question.answer)]) {
                    output.push(question.respFreq[String(question.answer)]);
                } else {
                    output.push(0)
                    // console.log(question, question.respFreq[String(question.answer)])
                }
            }
        });
        return output;
    };

    const getNonDistractors = answerLetterString => {
        let nonDistractor = "";
        if (!answerLetterString.includes("A")) {
            nonDistractor += "A";
        }
        if (!answerLetterString.includes("B")) {
            nonDistractor += "B";
        }
        if (!answerLetterString.includes("C")) {
            nonDistractor += "C";
        }
        if (!answerLetterString.includes("D")) {
            nonDistractor += "D";
        }
        return nonDistractor;
    };

    const getUnansweredTotal = respFreq => {
        let total = 0;
        Object.values(respFreq).forEach(value => {
            total += value;
        });
        return total;
    };
 
    const getItemDifficulty = (answer, respFreq, total) => {
        if ((respFreq[answer] / total).toFixed(4) * 100) {
            return ((respFreq[answer] / total) * 100).toFixed(2);
        } else {
            return 0;
        }
    };

    const getDiscrimination = number => {
        return number >= 31 && number <= 90 ? "Good" : "Check";
    };

    useEffect(_ => {
        setDatacollection({
            labels: getQuestionNumberGraphLabels(),
            datasets: [
                {
                    label: "Graph of Correct Responses",
                    data: getCorrectResponsesData(),
                    fill: false,
                    borderColor: "#ff3f5f",
                    tension: 0.5
                }
            ]
        })
    }, [questions, responses])

    const printReport = _ => {
        setPrintState('printing');
        // setTimeout(_ => {
        //     setPrintState('done')
        // }, 3000)
    };

    return (
        <div className='report'>
            <div className="report-content">
                <header className="header-bar">
                    <div className="header-text">
                        <h1>PrepTime Analysis Report</h1>
                        <h3>{ responseData.title }</h3>
                    </div>
                    <div className="header-actions">
                        <a href="#score-summary" className="hd-action">
                            <i className="fas fa-users"></i>
                            <span>{ responses ? responses.length : null}</span>
                        </a>
                        <a className="hd-action" onClick={printReport}>
                            <i className="fas fa-print"></i>
                        </a>
                    </div>
                </header>
                {
                    responses.length > 0 ? (
                        <div className="summary-content">
                            <div className="meta">
                                <h1 className="school bold">
                                    { metaData.schoolName }
                                </h1>
                                <h2 className="subject bold">
                                    Course/Subject: { metaData.subject }
                                </h2>
                                <p className="meta-txt class bold">
                                    Class: { metaData.class }
                                </p>
                                <p className="meta-txt bold">
                                    Test Title: { responseData.title }
                                </p>
                                <p className="meta-txt bold">
                                    Academic Year: { metaData.accademicYear }
                                </p>
                                <p className="meta-txt date">
                                    <i className="fas fa-calendar"></i>
                                    {data.moment(metaData.reportDate).format("ll")}
                                </p>
                            </div>
                            <div className="max-min">
                                <div className="min-max-flex">
                                    <div className="minmax-blk max">
                                        <div className="minmax-txt">
                                            <h4>MAXIMUM MARK</h4>
                                            <p className="bold">The maximum mark was scored by {responses[0]?.name}</p>
                                        </div>
                                        <h2 className="score">{responses[0]?.score} </h2>
                                    </div>
                                    <div className="minmax-blk min">
                                    <div className="minmax-txt">
                                            <h4>MINIMUM MARK</h4>
                                            <p className="bold">The minimum mark was scored by {responses[responses.length - 1]?.name}</p>
                                        </div>
                                        <h2 className="score">{responses[responses.length - 1]?.score} </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="sect-title">
                                <h1>Analysis of Answers</h1>
                                <Table tableId="table-aa" columns={data.headers}  rows={analysisTable} printState={printState} />
                            </div>
                            <div className="sect-title" id='score-summary'>
                                <h1>Summary of Scores</h1>
                                <Table tableId="table-sos" columns={data.summaryHeaders}  rows={responses} printState={printState} />
                            </div>
                            <div className="sect-title">
                                <h1>Graph of Correct Scores</h1>
                                <Line data={datacollection} />
                            </div>
                            {
                                loadedMissedQuestions ? <FrequentlyMissed missed={missedQuestions} /> : null

                            }
                        </div>
                    ) : (
                        <div className="load-container">
                            <Loader size={10} show={isLoading} />
                        </div>
                    )
                }
                <div className="foot-note">
                    <div className="foot-content">
                        <p>Data source to this report is neither created nor endorsed by SWPH.</p>
                        <p>&copy; 2022 -  <b>Scribble Works</b></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
