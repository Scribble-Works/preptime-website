import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AttachmentList from '../components/AttachmentList'
import Loader from '../components/Loader'
import driveIcon from '../assets/images/drive-icon.png'
import googleLogo from '../assets/logos/google-logo.png'
import readXlsxFile from 'read-excel-file'

export default function Picker() {

    const [uploadOption, setUploadOption] = useState('google');
    const [isAnalysing, setAnalysing] = useState(false);
    const [analysisDone, setAnalysisDone] = useState(false);
    const [tempAttachments, setTempAttachments] = useState([]);
    const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
    const [authToken, setAuthToken] = useState('');
    const [reportId, setReportId] = useState('');

    const [schoolName, setSchoolName] = useState('');
    const [subject, setSubject] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [reportClass, setReportClass] = useState('');
    const [questionsDataFile, setQuestionsDataFile] = useState('');
    const [responsesDataFile, setResponsesDataFile] = useState('');
    const [readyToAnalyze, setReadyToAnalyze] = useState(false);

    const [dataMatrix, setDataMatrix] = useState([]);
    const [questionsData, setQuestionsData] = useState([]);
    const [headerRowIndex, setHeaderRowIndex] = useState(0);
    const [optionsCount, setOptionsCount] = useState(4);
    const [seperator, setSeperator] = useState(',');
    const [downloadFileType, setDownloadFileType] = useState('csv');
    const [counter, setCounter] = useState(1);

    const developerKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const scope = "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/forms https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.external_request";
    const appSciptPath = process.env.REACT_APP_SCRIPT_URL;
    const url = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    /* global gapi */
    const driveIconClicked = async _ => {
        await gapi.load("auth2", async _ => {
            await gapi.auth2.authorize(
                {
                    client_id: clientId,
                    scope: scope,
                    immediate: false,
                    plugin_name: 'PrepTime'
                },
                handleAuthResult
            )
        })
    };

    const handleAuthResult = async authResult => {
        // console.log(process.env, authResult)
        if (authResult && authResult.access_token) {
            setAuthToken(authResult.access_token)
        }
    }

    useEffect(_ => {
        if (authToken !== '')
            gapi.load("picker", _ => {
                setPickerApiLoaded(true)
            })
    }, [authToken])

    useEffect(_ => {
        if (pickerApiLoaded)
            createPicker()
    }, [pickerApiLoaded])

    /* global google */
    const createPicker = () => {
        // console.log('Creating Picker', pickerApiLoaded, authToken)
        if (pickerApiLoaded && authToken) {
            const picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.MULTISELECT_DISABLED)
                .addView(google.picker.ViewId.SPREADSHEETS)
                .setOAuthToken(authToken)
                .setCallback(pickerCallback)
                .build();
            picker.setVisible(true);
            // console.log('Ready to build picker...')
        }
    }

    const pickerCallback = async data => {
        let url = 'nothing';
        let name = 'nothing';
        if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
            let doc = data[google.picker.Response.DOCUMENTS][0];
            url = doc[google.picker.Document.URL];
            name = doc.name;
            let docs = data.docs;
            let param = { fileId: doc.id, oAuthToken: authToken, name: name };
            let attachments = [];
            for (let i = 0; i < docs.length; i++) {
                let attachment = {};
                attachment._id = docs[i].id;
                attachment.title = docs[i].name;
                attachment.name = docs[i].name + "." + docs[i].mimeType.split("/")[1];
                attachment.type = "gDrive";
                attachment.description = "Shared with GDrive";
                attachment.extension =
                    "." + docs[i].mimeType.substring(docs[i].mimeType.lastIndexOf(".") + 1);
                attachment.iconURL = docs[i].iconUrl;
                attachment.size = docs[i].sizeBytes;
                attachment.user = JSON.parse(localStorage.getItem("user"));
                attachment.thumb = null;
                attachment.thumb_list = null;
                attachments.push(attachment);
            }
            setTempAttachments([...attachments])
        }
        setAuthToken(null)
        setPickerApiLoaded(false)
    }

    const fieldEmpty = _ => {
        const fields = [schoolName, subject, reportClass, academicYear];
        let emptyFields = fields.some(val => val === '');
        if (emptyFields.length > 0)
            return true;
        else
            return false;
    }

    const callScriptFunction = async _ => {
        if (fieldEmpty()) {
            alert('Please make sure you fill out the details of your analysis report before you run the analysis!')
            return;
        }
        setAnalysing(true)
        try {
            let meta = {
                schoolName: schoolName,
                subject: subject,
                class: reportClass,
                academicYear: academicYear,
                sheetId: tempAttachments[0]._id,
                uploaded: 'google'
            };

            let req = {
                function: "postResponses",
                parameters: [meta],
                devMode: false,
            };

            await gapi.load("client", async _ => {
                await gapi.client.request({
                    path: appSciptPath,
                    method: 'POST',
                    body: req,
                })
                .then(data => {
                    setAnalysing(false)

                    if (data.result.error) {
                        if (data.result.error.details[0].errorMessage) {
                            alert(data.result.error.details[0].errorMessage);
                        } else {
                            alert(
                                "An error occrred while trying to analyze your results. Please try again later"
                            );
                        }
                    } else if (data.result.response.result) {
                        const res = JSON.parse(data.result.response.result);
                        // console.log(res)
                        const { _id, fetchOutput, fetchData } = res;
                        // console.log(JSON.parse(fetchOutput), fetchData)
                        setReportId(_id)
                        setAnalysisDone(true)
                    }
                })
            })

        } catch (err) {
            console.log('An error occured whilst analysing your data\n', err.message)
        }
    }

    const sendData = _ => {
        if (fieldEmpty()) {
            alert('Please make sure you fill out the details of your analysis report before you run the analysis!')
            return;
        }
        setAnalysing(true)
        try {
            let meta = {
                collectsEmail: false,
                schoolName: schoolName,
                subject: subject,
                class: reportClass,
                academicYear: academicYear,
                sheetId: '',
                reportDate: new Date().toISOString(),
                uploaded: 'local'
            };

            let req = {
                created_at: new Date().toISOString(),
                metaData: meta,
                sheet_id: '',
                title: `${meta.subject} (Responses)`,
                dataMatrix: dataMatrix,
                questions: questionsData
            };

            // const url = 'http://localhost:5000';
            fetch(`${url}/api/scribbleworks-demoresponses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                setReportId(data._id)
                setAnalysisDone(true)
            })

        } catch (err) {
            console.log('An error occured whilst analysing your data\n', err.message)
        }
    }

    const removeAttachments = _ => { setTempAttachments([]) };

    const changeOption = e => {
        setUploadOption(e.target.value)
        // console.log(e.target.value)
    }

    const focusInput = e => {
        const id = e.target.id;
        document.querySelector(`.input-field.${id}`).classList.add('focused')
    }

    const blurInput = e => {
        const id = e.target.id;
        if (e.target.value === '')
            document.querySelector(`.input-field.${id}`).classList.remove('focused')
        else
            return;
    }

    const openReport = _ => {
        const path = `/report/${reportId}`;
        navigate(path)
    }

    const uploadFile = fid => {
        const fileEl = document.getElementById(fid);
        fileEl.click()
    }

    const readFile = e => {
        if (e.target.files.length === 0)
            return;
        const file = e.target.files[0];
        const id = e.target.id;
        if (id === 'ques-file') {
            setQuestionsDataFile(file.name)
            handleFile(file, 'questions')
        } else if (id === 'res-file') {
            setResponsesDataFile(file.name)
            handleFile(file, 'responses')
        }
    }

    // const extractQuestionsData = data => {

    // }

    const parseCSVResponseData = data => {
        // console.log(questionsData)
        const regex = new RegExp(`(\\s*"[^"]+"\\s*|\\s*[^${seperator}]+|${seperator})(?=${seperator}|$)`, 'g');
        const dataLineArray = data.split('\n').map(line => line.trim());
        // console.log('Response data before been parsed:', dataLineArray)
        const firstLine = dataLineArray[0];
        let header = firstLine.includes('Index Number:') ? 
        firstLine.split(',').slice(0,3) : firstLine.split(',').slice(0,2);
        header = firstLine.includes('Index Number:') ? header : [header[0], 'Index Number:', header[1]];
        // console.log(header)

        let dataArray = dataLineArray.slice(1, dataLineArray.length).map(line => {
            if (line === '') return;
            let row = line.match(regex).map(val => val.trim());
            if (firstLine.includes('Index Number:')) {
                row[2] = row[2].indexOf('/') >= 0 ? 
                Number(row[2].split('/')[0].trim()) : Number(row[2].trim());
            } else {
                row[1] = row[1].indexOf('/') >= 0 ? 
                Number(row[1].split('/')[0].trim()) : Number(row[1].trim());
                row = [row[0], 'nan', ...row.slice(1)];
            }

            row.unshift(new Date().toISOString())
            // console.log(row)
            return row;
        })
        const questionTitles = [ ...questionsData.slice(2) ].map(ques => ques.title);
        header = [ 'Timestamp', ...header, ...questionTitles ];
        dataArray.unshift(header)
        dataArray = dataArray.filter(arr => arr !== undefined).filter(res => {
            let nullCount = 0;
            for (let cell of res) {
                if (cell === 'NaN' || cell === '')
                    nullCount += 1;
                else
                    continue;
            }
            return nullCount < header.length;
        });
        setDataMatrix(dataArray)
        // console.log('Response data after beign parsed:', dataArray)
    }

    const parseCSVQuestionsData = data => {
        // console.log(data)
        const regex = new RegExp(`(\\s*"[^"]+"\\s*|\\s*[^${seperator}]+|${seperator})(?=${seperator}|$)`, 'g');
        const dataLineArray = data.split('\n').map(line => line.trim());
        // console.log('Questions data before been parsed:', dataLineArray)
        let dataArray = dataLineArray.slice(0, dataLineArray.length - 1).map(line => {
            const row = line.match(regex).map(val => val.trim());
            // console.log('questions:', row)
            return row;
        })
        return parseExcelQuestionsData(dataArray)
    }

    const parseExcelResponseData = data => {
        const firstLine = data[0];
        const header = firstLine.includes('Index Number:') ? 
        ['Timestamp', ...data[0]] : 
        ['Timestamp', firstLine[0], 'Index Number:', ...firstLine.slice(1)];

        const newData = data.slice(1).map(row => {
            let newRow = [ ...row ];
            if (firstLine.includes('Index Number:')) {
                const isNumber = typeof newRow[2] == 'number';
                newRow[2] = !isNumber && newRow[2].indexOf('/') >= 0 ? 
                Number(newRow[2].split('/')[0].trim()) : 
                !isNumber && newRow[2].indexOf('/') < 0 ? 
                Number(newRow[2].trim()) :  newRow[2];
                newRow = [new Date().toISOString(), ...newRow];
            } else {
                const isNumber = typeof newRow[1] == 'number';
                newRow[1] = !isNumber && newRow[1].indexOf('/') >= 0 ? 
                Number(newRow[1].split('/')[0].trim()) : 
                !isNumber && newRow[1].indexOf('/') < 0 ? 
                Number(newRow[1].trim()) :  newRow[1];
                newRow = [new Date().toISOString(), newRow[0], 'nan', ...newRow.slice(1)];
            }
            return newRow;
        });

        newData.unshift(header)
        setDataMatrix(newData)
        // console.log(newData)
    }

    const parseExcelQuestionsData = data => {
        // console.log('before parsing data', data)
        let parsedData = [
            { id: Math.round(Math.random() * 1000), type: 'TEXT', choices: null },
            { id: Math.round(Math.random() * 1000), type: 'TEXT', choices: null }
        ];

        const rowHeader = data[headerRowIndex];
        for (let i = 0; i < data.slice(1).length; i++) {
            const rowArray = rowHeader[0] == null || rowHeader[0] == '' ? [ ...data[i + 1].slice(1) ] : [ ...data[i + 1] ];
            const answer = rowArray[rowArray.length - 2];
            const points = rowArray[rowArray.length - 1];
            let choices = rowArray.slice(2, 2 + optionsCount).map(opt => {
                return {
                    value: opt,
                    isCorrectAnswer: opt === answer
                }
            });
            parsedData.push({
                id: Number(rowArray[0]),
                title: rowArray[1],
                choices: choices,
                points: Number(points),
                answer: '',
                index: i + 1,
                type: 'MULTIPLE_CHOICE'
            });
        }
        // console.log('after parsing data', parsedData)
        return parsedData
    }

    const handleFile = async (file, type) => {
        const fileType = file.type.split('/')[1];
        if (fileType.indexOf('.sheet') >= 0) {
            const fileContent = await readXlsxFile(file);
            // console.log(fileContent)
            if (type === 'responses') {
                parseExcelResponseData(fileContent)
            } else {
                const questions = parseExcelQuestionsData(fileContent);
                setQuestionsData(questions)
            }
        } else {
            const reader = new FileReader();
            reader.onload = ev => {
                const fileContent = ev.target.result;
                if (type === 'responses') {
                    parseCSVResponseData(fileContent)
                } else {
                    const questions = parseCSVQuestionsData(fileContent)
                    setQuestionsData(questions)
                }
            }
            reader.readAsText(file)
        }
    }

    const clearQuestions = _ => {
        setQuestionsData([]);
        setQuestionsDataFile('');
    };

    const clearResponses = _ => {
        setDataMatrix([]);
        setResponsesDataFile('');
    };

    const restart = _ => {
        setAnalysing(false);
        setAnalysisDone(false);
        setUploadOption('google');
        setTempAttachments([]);
        setQuestionsDataFile('');
        setResponsesDataFile('');
    };

    const switchTab = e => {
        setDownloadFileType(e.target.value)
        const tab = e.target.value;
        const carousel = document.querySelector('.dl-carousel-content');
        const carouselItem = Array.from(document.querySelectorAll('.dl-opt'))[0];
        const carouselItemWidth = carouselItem.getBoundingClientRect().width;
        carousel.style.transition = 'transform .3s ease';
        if (tab === 'excel')
            carousel.style.transform = `translateX(-${carouselItemWidth}px)`;
        else
            carousel.style.transform = 'translateX(0px)';
    };

    useEffect(_ => {
        if (uploadOption === 'google') {
            const googleUpload = document.querySelector('.g-upload-content');
            const localUpload = document.querySelector('.l-upload-content');
            const gUploadHeight = googleUpload.scrollHeight;
            googleUpload.style.maxHeight = `${gUploadHeight + 10}px`;
            googleUpload.style.opacity = '1';
            localUpload.style.maxHeight = '0px';
            localUpload.style.opacity = '0';

            if (tempAttachments.length > 0)
                setReadyToAnalyze(true)
            else
                setReadyToAnalyze(false)
        } else if (uploadOption === 'local') {
            const googleUpload = document.querySelector('.g-upload-content');
            const localUpload = document.querySelector('.l-upload-content');
            const localUploadHeight = localUpload.scrollHeight;
            localUpload.style.maxHeight = `${localUploadHeight + 10}px`;
            localUpload.style.opacity = '1';
            googleUpload.style.maxHeight = '0px';
            googleUpload.style.opacity = '0';

            if (questionsDataFile != '' && responsesDataFile != '')
                setReadyToAnalyze(true)
            else
                setReadyToAnalyze(false)
        }
    }, [uploadOption, tempAttachments, questionsDataFile, responsesDataFile])

    const openModal = _ => {
        const modal = document.querySelector('.dl-modal');
        modal.classList.add('open-modal');
    };

    const hideModal = _ => {
        const modal = document.querySelector('.dl-modal');
        modal.classList.remove('open-modal');
    };

    useEffect(_ => {
        window.addEventListener('click', e => {
            const target = e.target;
            try {
                const modal = document.querySelector('.dl-modal');
                const modalContent = modal.querySelector('.dl-modal-content');
                if (!modalContent.contains(target) && !target.classList.contains('dl'))
                    modal.classList.remove('open-modal');
                else
                    return;
            } catch (err) {
                (_ => {})()
            }
        })

        const downloadLinks = document.querySelectorAll('.dl-text');
        downloadLinks.forEach(async link => {
            const filename = link.querySelector('span').textContent;
            // const url = 'http://localhost:5000';
            let data = await (await fetch(`${url}/download/${filename}`)).arrayBuffer();
            let file = new File([data], filename, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            let fileUrl = URL.createObjectURL(file);
            link.href = fileUrl;
            link.download = file.name;
        })
    }, [])

    return (
        <div>
            <div className="dl-modal">
                <div className="dl-modal-content">
                    <span className="close-btn" onClick={hideModal}>
                        <i className="fas fa-times"></i>
                    </span>
                    <h3 className="dl-title">Download templates</h3>
                    <div className="tabs">
                        <div className={`tab ${downloadFileType === 'csv' ? 'active' : ''}`}>
                            <input type="radio" id='csv' name='dl-type' checked={downloadFileType === 'csv'} value="csv" onChange={switchTab} />
                            <label htmlFor="csv">CSV</label>
                        </div>
                        <div className={`tab ${downloadFileType === 'excel' ? 'active' : ''}`}>
                            <input type="radio" id='excel' name='dl-type' value="excel" checked={downloadFileType === 'excel'} onChange={switchTab} />
                            <label htmlFor="excel">Excel</label>
                        </div>
                    </div>
                    <div className="dl-carousel">
                        <div className="dl-carousel-content">
                            <div className="dl-opt" data-index={0}>
                                <span className="icon">
                                    <i className="fas fa-file-csv"></i>
                                </span>
                                <a className="dl-text">
                                    <i className="fas fa-download"></i>
                                    <span>Questions-template.csv</span>
                                </a>
                                <a className="dl-text">
                                    <i className="fas fa-download"></i>
                                    <span>Responses-template.csv</span>
                                </a>
                            </div>
                            <div className="dl-opt" data-index={1}>
                                <span className="icon">
                                    <i className="fas fa-file-excel"></i>
                                </span>
                                <a className="dl-text">
                                    <i className="fas fa-download"></i>
                                    <span>Questions-template.xlsx</span>
                                </a>
                                <a className="dl-text">
                                    <i className="fas fa-download"></i>
                                    <span>Responses-template.xlsx</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className='sect-picker bg-slate-light  pt-12 md:pt-[150px] min-h-[80vh]'>
                <div className='max-w-default py-12 md:py-[30px] mx-6 lg:m-auto'>
                    {
                        !isAnalysing && !analysisDone ? (
                            <div className="picker-content">
                                <ul className="picker-options">
                                    <li className="w-gdrive">
                                        <input type="checkbox" id='gDrive' className='upload-option' value="google" checked={uploadOption === 'google'} onChange={changeOption} />
                                        <label htmlFor="gDrive" className='checklabel'>
                                            <span className="picker-title bold">Upload with Google Drive</span>
                                        </label>
                                        <div className="g-upload-content upl-cnt">
                                            <p className="font-norm">Before we begin, please make sure you have owevership or editor access to both the Google Form and it's corresponding Google Sheet.</p>
                                            <div className="upload-step flex flex-col align-center">
                                                <h2 className="step-title">Step 1: Pick a Quiz Responses File</h2>
                                                <button className="gdrive-upload" onClick={driveIconClicked}>
                                                    <img src={googleLogo} alt="google drive icon" width="25" height="25" />
                                                    <span>Sign in with Google</span>
                                                </button>
                                                {
                                                    tempAttachments.length > 0 && !isAnalysing ?
                                                    <AttachmentList tempAttachments={tempAttachments} clearFunc={removeAttachments} /> : null

                                                }
                                            </div>
                                        </div>
                                    </li>
                                    <li className="local-upload">
                                        <input type="checkbox" id="lDrive" className="upload-option" value="local" checked={uploadOption === 'local'} onChange={changeOption} />
                                        <label htmlFor="lDrive" className='checklabel for-ldrive'>
                                            <span className="picker-title bold">Upload CSV/Excel from Local Drive</span>
                                        </label>
                                        <div className="l-upload-content upl-cnt">
                                            <p className="note">For the analysis to be generated successfully, the data contained in your questions and responses csv/excel files is expected to be in the right format as specified in the file templates. Click <a className="dl" onClick={openModal}>here</a> to download templates for the questions and responses in CSV or Excel sheet format.</p>
                                            <div className="uploads-sect">
                                                <p className="up-blk-title bold">Questions:</p>
                                                <div className="upload-blk up-questions">
                                                    <a className="btn-upload" onClick={_ => uploadFile('ques-file')}>
                                                        <i className="fas fa-file-alt"></i>
                                                        <span className="bold">Select a CSV/Excel file to upload</span>
                                                        {/* <span className="tiny-txt">or drag and drop it here</span> */}
                                                        <input type="file" id="ques-file" hidden accept=".csv,.xlsx, .xls, .tsv, .txt" onChange={readFile} />
                                                    </a>
                                                    {
                                                        questionsDataFile ? (
                                                            <p className="l-upl-filename">
                                                                <span>{ questionsDataFile }</span>
                                                                <span className="cl-btn" onClick={clearQuestions}>
                                                                    <i className="fas fa-times"></i>
                                                                </span>
                                                            </p>
                                                        ) : null
                                                    }
                                                </div>
                                                <p className="up-blk-title bold">Responses:</p>
                                                <div className={ `upload-blk up-response ${questionsData.length === 0 ? 'disabled' : ''}`}>
                                                    <a className="btn-upload" onClick={_ => uploadFile('res-file')}>
                                                        <i className="fas fa-file-alt"></i>
                                                        <span className="bold">Select a CSV/Excel file to upload</span>
                                                        {/* <span className="tiny-txt">or drag and drop it here</span> */}
                                                        <input type="file" id="res-file" hidden accept=".csv,.xlsx, .xls, .tsv, .txt" onChange={readFile} />
                                                    </a>
                                                    {
                                                        responsesDataFile ? (
                                                            <p className="l-upl-filename">
                                                                <span>{ responsesDataFile }</span>
                                                                <span className="cl-btn" onClick={clearResponses}>
                                                                    <i className="fas fa-times"></i>
                                                                </span>
                                                            </p>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                {
                                    readyToAnalyze ? (
                                        <>
                                            <div className="form-fields">
                                                <h2 className="step-title">{ uploadOption === 'local' ? 'Step 3' : 'Step 2'}: Fill out the details of your analysis report.</h2>
                                                <div className="input-grid">
                                                    <div className="input-field schoolname">
                                                        <label htmlFor="schoolname">School Name</label>
                                                        <input type="text" id="schoolname" onFocus={focusInput} onBlur={blurInput} onInput={e => setSchoolName(e.target.value)} />
                                                    </div>
                                                    <div className="input-field subject">
                                                        <label htmlFor="subject">Subject</label>
                                                        <input type="text" id="subject" onFocus={focusInput} onBlur={blurInput} onInput={e => setSubject(e.target.value)} />
                                                    </div>
                                                    <div className="input-field class">
                                                        <label htmlFor="class">Class eg. Form 1</label>
                                                        <input type="text" id="class" onFocus={focusInput} onBlur={blurInput} onInput={e => setReportClass(e.target.value)} />
                                                    </div>
                                                    <div className="input-field academicYear">
                                                        <label htmlFor="acdemicYear">Academic Year</label>
                                                        <input type="text" id="academicYear" onFocus={focusInput} onBlur={blurInput} onInput={e => setAcademicYear(e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                uploadOption === 'google' ? (
                                                    <div className="btn-container">
                                                        <h2 className="step-title last-step">Step 3</h2>
                                                        <button className="run" onClick={callScriptFunction}>Run Analysis!</button>
                                                    </div>
                                                ) : (
                                                    <div className="btn-container">
                                                        <h2 className="step-title last-step">Step 4</h2>
                                                        <button className="run" onClick={sendData}>Run Analysis!</button>
                                                    </div>
                                                )
                                            }
                                        </>
                                    ) : null
                                }
                            </div>
                        ) : isAnalysing && !analysisDone ? (
                            <div className="is-running">
                                <h2 className="step-title">Running analysis, please wait...</h2>
                                <Loader size={15} show={isAnalysing} />
                            </div>
                        ) : (
                            <div className="done-analyzing">
                                <h2>Thank you for using PrepTime Analysis</h2>
                                <p>Your report has been generated. View it by clicking the button below</p>
                                <div className="done-btn-group">
                                    <button className='success' onClick={openReport}>Open Analysis</button>
                                    <button className="continue" onClick={restart}>Prepare another report</button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </section>
        </div>
    )
}
