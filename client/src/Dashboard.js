import React, { useEffect, useState, useRef } from 'react';
import { Grid, Button, Image } from 'semantic-ui-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './fonts.css';
import './Dashboard.css';
import quizlogo from './images/quizlogo.png';
import quizbackground from './images/quizbackground.png';
import correctAnswerImage from './images/correct.png';
import incorrectAnswerImage from './images/incorrect.png';
import keeptryingImage from './images/keeptrying.png';
import doingwellImage from './images/doingwell.png';

const Dashboard = () => {
    const [deviceType, setDeviceType] = useState('ipad');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const correctAnswersCount = useRef(0);
    const [isQuestionLoaded, setIsQuestionLoaded] = useState(false);
    const [isAnswersLoaded, setIsAnswersLoaded] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [correctAnswerIdRender, setCorrectAnswerIdRender] = useState();
    const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
    const [correctAnswerContent, setCorrectAnswerContent] = useState('');
    const [showTemporaryPage, setShowTemporaryPage] = useState(false);
    const navigate = useNavigate();

    const questions = [
        { text: 'What year was the University founded as the Ballarat School of Mines?', options: ['1870', '1890', '1900', '1910'], correctAnswerId: 0 },
        { text: 'What was Sir Albert Coates renowned for?', options: ['Ballarat War Surgeon', 'Ballarat Inventor', 'Ballarat Gold Miner', 'Ballarat Historian'], correctAnswerId: 0 },
        { text: 'What year was the Sydney Harbour Bridge Opened?', options: ['1929', '1932', '1935', '1937'], correctAnswerId: 1 },
        { text: 'From which direction does the Sun rise?', answer: 'East' },
        { text: 'What is the largest bone in the body?', answer: 'Femur' },
        { text: 'How many moons does Mars have?', options: ['One', 'Two', 'Three', 'Four'], correctAnswerId: 1 },
        { text: 'What is the largest ocean in the world?', options: ['The Pacific Ocean', 'The Indian Ocean', 'The Southern Ocean', 'The Atlantic Ocean'], correctAnswerId: 0 },
        { text: 'Which continent is closest to Antarctica?', answer: 'South America' },
        { text: 'What is the official language of Brazil?', options: ['Portuguese', 'Spanish', 'English', 'French'], correctAnswerId: 0 },
        { text: 'Which of the Federation University campuses is on Boon Warrung lands?', options: ['Mt Helen', 'Berwick', 'Churchill', 'Horsham'], correctAnswerId: 1 },
        { text: 'What is the oldest tropical rainforest in the world', options: ['The Amazon Rainforest', 'The Daintree Rainforest', 'Borneo Lowland Rainforest', 'Taman Negara'], correctAnswerId: 1 },
        { text: 'What country would you find the Eiffel Tower?', answer: 'France' },
        { text: 'What is Winnie the Pooh’s favourite food?', answer: 'Honey' },
        { text: 'Mixing red and yellow creates what colour?', answer: 'Orange' },
        { text: 'Other than in 2000, what year has Australia hosted the Olympic Games?', answer: '1956' },
    ];

    const handleResize = () => {
        const width = window.innerWidth;
        setDeviceType(width <= 767 ? 'phone' : 'ipad');
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setIsQuestionLoaded(false);
        setIsAnswersLoaded(false);
        const questionTimer = setTimeout(() => {
            setIsQuestionLoaded(true);
        }, 100);
        const answersTimer = setTimeout(() => {
            setIsAnswersLoaded(true);
        }, 1000);
        return () => {
            clearTimeout(questionTimer);
            clearTimeout(answersTimer);
        };
    }, [currentQuestionIndex]);

    const handleAnswerClick = (answerId) => {
        const correctAnswerText = questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctAnswerId];
        if (answerId === questions[currentQuestionIndex].correctAnswerId) {
            correctAnswersCount.current += 1;
            setAnsweredCorrectly(true);
            setCorrectAnswerIdRender(answerId);
        } else {
            setAnsweredCorrectly(false);
            setCorrectAnswerIdRender(questions[currentQuestionIndex].correctAnswerId);
        }
        setShowModal(true);
        setTimeout(() => handleCloseModal(answerId), 3000);
    };

    const handleSubmitAnswer = () => {
        const correctAnswer = questions[currentQuestionIndex].answer;
        if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
            correctAnswersCount.current += 1;
            setAnsweredCorrectly(true);
        } else {
            setAnsweredCorrectly(false);
            setCorrectAnswerContent(correctAnswer);
        }
        setShowModal(true);
        setUserAnswer('');
        setTimeout(() => handleCloseModal(), 3000);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (currentQuestionIndex < questions.length - 1) {
            if (currentQuestionIndex === 7) {
                setShowTemporaryPage(true);
                setTimeout(() => {
                    setShowTemporaryPage(false);
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                }, 3000);
            } else {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        } else {
            navigate('/register', { state: { correctAnswersCount: correctAnswersCount.current } });
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <Grid style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
            {showTemporaryPage ? (
                correctAnswersCount.current >= 4 ?
                    <>
                        <Grid style={{ height: '14vh', margin: 0, padding: 0 }}>
                            <Grid.Row style={{ margin: 0, padding: 0, background: '#ffffff', height: '2vh' }} columns={questions.length}>
                                {questions.map((_, index) => (
                                    <Grid.Column
                                        key={index}
                                        fluid
                                        style={{ background: index <= currentQuestionIndex ? '#14E399' : '' }}
                                    >
                                        <div style={{ opacity: 0 }}>s</div>
                                    </Grid.Column>
                                ))}
                            </Grid.Row>
                            <Grid.Row style={{
                                margin: 0, padding: 0, height: '10vh', backgroundImage: `url(${quizbackground})`,
                                backgroundSize: deviceType === 'phone' ? '100% 100%' : '105% 100%',
                                backgroundPosition: 'center'
                            }}>
                                <Grid.Column floated='left' textAlign='left' width={8} style={{
                                    color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'normal',
                                    fontSize: deviceType === 'phone' ? '4vw' : '3vw',
                                }}>
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </Grid.Column>
                                <Grid.Column floated='right' textAlign='right' width={8} style={{
                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Image src={quizlogo} style={{ width: deviceType === 'ipad' ? '20vw' : '30vw' }} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                        <Grid.Row style={{ margin: 0, padding: 0, height: '26vh' }}></Grid.Row>

                        <Grid.Row style={{ margin: 0, padding: 0, height: '26vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src={doingwellImage} size='small' />
                        </Grid.Row>
                        {
                            deviceType === 'phone' ?
                                <>
                                    <Grid.Row style={{
                                        color: '#14E399', fontSize: '7vh',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        You're 
                                    </Grid.Row>
                                    <Grid.Row style={{
                                        color: '#14E399', fontSize: '7vh',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        doing
                                    </Grid.Row>
                                    <Grid.Row style={{
                                        color: '#14E399', fontSize: '7vh',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        well
                                    </Grid.Row>
                                </>
                                :
                                <Grid.Row style={{
                                    color: '#14E399', fontSize: '7vh',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}>
                                    You're doing well
                                </Grid.Row>
                        }
                    </>
                    :
                    <>
                        <Grid style={{ height: '14vh', margin: 0, padding: 0 }}>
                            <Grid.Row style={{ margin: 0, padding: 0, background: '#ffffff', height: '2vh' }} columns={questions.length}>
                                {questions.map((_, index) => (
                                    <Grid.Column
                                        key={index}
                                        fluid
                                        style={{ background: index <= currentQuestionIndex ? '#14E399' : '' }}
                                    >
                                        <div style={{ opacity: 0 }}>s</div>
                                    </Grid.Column>
                                ))}
                            </Grid.Row>
                            <Grid.Row style={{
                                margin: 0, padding: 0, height: '10vh', backgroundImage: `url(${quizbackground})`,
                                backgroundSize: deviceType === 'phone' ? '100% 100%' : '105% 100%',
                                backgroundPosition: 'center'
                            }}>
                                <Grid.Column floated='left' textAlign='left' width={8} style={{
                                    color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'normal',
                                    fontSize: deviceType === 'phone' ? '4vw' : '3vw',
                                }}>
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </Grid.Column>
                                <Grid.Column floated='right' textAlign='right' width={8} style={{
                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Image src={quizlogo} style={{ width: deviceType === 'ipad' ? '20vw' : '30vw' }} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                        <Grid.Row style={{ margin: 0, padding: 0, height: '26vh' }}></Grid.Row>

                        <Grid.Row style={{ margin: 0, padding: 0, height: '26vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src={keeptryingImage} size='small' />
                        </Grid.Row>
                        {
                            deviceType === 'phone' ?
                                <>
                                    <Grid.Row style={{
                                        color: '#0602FF', fontSize: '7vh',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        Keep
                                    </Grid.Row>
                                    <Grid.Row style={{
                                        color: '#0602FF', fontSize: '7vh',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        trying
                                    </Grid.Row>
                                </>
                                :
                                <Grid.Row style={{
                                    color: '#0602FF', fontSize: '7vh',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}>
                                    Keep trying
                                </Grid.Row>
                        }
                    </>
            ) : (
                <>
                    <Grid style={{ height: '14vh', margin: 0, padding: 0 }}>
                        <Grid.Row style={{ margin: 0, padding: 0, background: '#ffffff', height: '2vh' }} columns={questions.length}>
                            {questions.map((_, index) => (
                                <Grid.Column
                                    key={index}
                                    fluid
                                    style={{ background: index <= currentQuestionIndex ? '#14E399' : '' }}
                                >
                                    <div style={{ opacity: 0 }}>s</div>
                                </Grid.Column>
                            ))}
                        </Grid.Row>
                        <Grid.Row style={{
                            margin: 0, padding: 0, height: '10vh', backgroundImage: `url(${quizbackground})`,
                            backgroundSize: deviceType === 'phone' ? '100% 100%' : '105% 100%',
                            backgroundPosition: 'center'
                        }}>
                            <Grid.Column floated='left' textAlign='left' width={8} style={{
                                color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'normal',
                                fontSize: deviceType === 'phone' ? '4vw' : '3vw',
                            }}>
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </Grid.Column>
                            <Grid.Column floated='right' textAlign='right' width={8} style={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image src={quizlogo} style={{ width: deviceType === 'ipad' ? '20vw' : '30vw' }} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid style={{ margin: 0, padding: 0, height: '86vh', background: '#ffffff' }}>
                        <Grid.Row style={{ margin: 0, padding: 0, height: '20vh' }}>
                            {
                                !showModal ?
                                    deviceType === 'phone' ?
                                        <Grid.Column textAlign='center' style={{
                                            fontSize: '6vw', fontWeight: '700', color: '#0602FF',
                                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', lineHeight: '1'
                                        }}>
                                            <motion.div
                                                key={currentQuestion.text}
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {currentQuestion.text}
                                            </motion.div>
                                        </Grid.Column>
                                        :
                                        <>
                                            <Grid.Row style={{ margin: 0, padding: 0, height: '46vh' }}></Grid.Row>

                                            <Grid.Column width={2}></Grid.Column>
                                            <Grid.Column width={12} textAlign='center' style={{
                                                fontSize: '4vw', fontWeight: '700', color: '#0602FF',
                                                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                                alignItems: 'center', lineHeight: '1'
                                            }}>
                                                <motion.div
                                                    key={currentQuestion.text}
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    {currentQuestion.text}
                                                </motion.div>
                                            </Grid.Column>
                                            <Grid.Column width={2}></Grid.Column>
                                        </>
                                    : <></>
                            }
                        </Grid.Row>
                        {
                            currentQuestion.options ? (
                                deviceType === 'phone' ?
                                    !showModal ?
                                        <Grid.Row style={{ margin: 0, padding: 0, height: '66vh' }}>
                                            <Grid.Column textAlign='center'>
                                                {currentQuestion.options.map((option, index) => (
                                                    <motion.div
                                                        key={option}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: isAnswersLoaded ? 1 : 0 }}
                                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                                    >
                                                        <Button
                                                            size={deviceType === 'phone' ? 'huge' : 'massive'}
                                                            style={{ color: 'white', border: '3px #14E399 solid', borderRadius: '30px', background: '#0602FF', width: deviceType === 'phone' ? '60vw' : '40vw', margin: '2vh' }}
                                                            onClick={() => handleAnswerClick(index)}
                                                        >
                                                            {option}
                                                        </Button>
                                                    </motion.div>
                                                ))}
                                            </Grid.Column>
                                        </Grid.Row>
                                        :
                                        answeredCorrectly ?
                                            <>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '26vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image src={correctAnswerImage} size='small' />
                                                </Grid.Row>
                                                <Grid.Row style={{
                                                    color: '#14E399', fontSize: '7vh',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    Correct!
                                                </Grid.Row>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '66vh' }}>
                                                    <Grid.Column textAlign='center'>
                                                        {currentQuestion.options.map((option, index) => (
                                                            index !== correctAnswerIdRender ?
                                                                <Button
                                                                    size={deviceType === 'phone' ? 'huge' : 'massive'}
                                                                    style={{ color: 'white', border: '3px #14E399 solid', borderRadius: '30px', background: '#0602FF', width: deviceType === 'phone' ? '60vw' : '40vw', margin: '2vh' }}
                                                                >
                                                                    {option}
                                                                </Button>
                                                                :
                                                                <Button
                                                                    size={deviceType === 'phone' ? 'huge' : 'massive'}
                                                                    style={{ color: '#0602FF', border: '3px #14E399 solid', borderRadius: '30px', background: '#14E399', width: deviceType === 'phone' ? '60vw' : '40vw', margin: '2vh' }}
                                                                >
                                                                    {option}
                                                                </Button>
                                                        ))}
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </>
                                            :
                                            <>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '26vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image src={incorrectAnswerImage} size='small' />
                                                </Grid.Row>
                                                <Grid.Row style={{
                                                    color: '#0602FF', fontSize: '7vh',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    Incorrect!
                                                </Grid.Row>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '66vh' }}>
                                                    <Grid.Column textAlign='center'>
                                                        {currentQuestion.options.map((option, index) => (
                                                            index !== correctAnswerIdRender ?
                                                                <Button
                                                                    size={deviceType === 'phone' ? 'huge' : 'massive'}
                                                                    style={{ color: 'white', border: '3px #14E399 solid', borderRadius: '30px', background: '#0602FF', width: deviceType === 'phone' ? '60vw' : '40vw', margin: '2vh' }}
                                                                >
                                                                    {option}
                                                                </Button>
                                                                :
                                                                <Button
                                                                    size={deviceType === 'phone' ? 'huge' : 'massive'}
                                                                    style={{ color: '#0602FF', border: '3px #0602FF solid', borderRadius: '30px', background: 'white', width: deviceType === 'phone' ? '60vw' : '40vw', margin: '2vh' }}
                                                                >
                                                                    {option}
                                                                </Button>
                                                        ))}
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </>
                                    :
                                    !showModal ?
                                        <>
                                            <Grid.Row style={{ margin: 0, padding: 0, height: '40vh' }}></Grid.Row>
                                            <Grid.Row style={{ margin: 0, padding: 0, height: '20vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <Grid.Column textAlign='center' style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                                    {currentQuestion.options.map((option, index) => (
                                                        <motion.div
                                                            key={option}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: isAnswersLoaded ? 1 : 0 }}
                                                            transition={{ duration: 0.5, delay: index * 0.2 }}
                                                            style={{ display: 'inline-block', margin: '0 1vw' }}
                                                        >
                                                            <Button
                                                                size={deviceType === 'phone' ? 'huge' : 'large'}
                                                                style={{
                                                                    width: deviceType === 'ipad' ? '20vw' : '', height: deviceType === 'ipad' ? '10vh' : '', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                                                    color: 'white', border: '3px #14E399 solid', borderRadius: '50px', background: '#0602FF', padding: '1em 1em'
                                                                }}
                                                                onClick={() => handleAnswerClick(index)}
                                                            >
                                                                {option}
                                                            </Button>
                                                        </motion.div>
                                                    ))}
                                                </Grid.Column>
                                            </Grid.Row>
                                        </>
                                        :
                                        answeredCorrectly ?
                                            <>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '26vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image src={correctAnswerImage} size='small' />
                                                </Grid.Row>
                                                <Grid.Row style={{
                                                    color: '#14E399', fontSize: '7vh',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    Correct!
                                                </Grid.Row>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    {currentQuestion.options.map((option, index) => (
                                                        index !== correctAnswerIdRender ?
                                                            <Button
                                                                size='large'
                                                                style={{
                                                                    width: '20vw', height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                                    color: 'white', border: '3px #14E399 solid', borderRadius: '50px', background: '#0602FF', padding: '1em 1em'
                                                                }}
                                                            >
                                                                {option}
                                                            </Button>
                                                            :
                                                            <Button
                                                                size='large'
                                                                style={{
                                                                    width: '20vw', height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                                    color: '#0602FF', border: '3px #14E399 solid', borderRadius: '50px', background: '#14E399', padding: '1em 1em'
                                                                }}
                                                            >
                                                                {option}
                                                            </Button>
                                                    ))}
                                                </Grid.Row>
                                            </>
                                            :
                                            <>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '26vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image src={incorrectAnswerImage} size='small' />
                                                </Grid.Row>
                                                <Grid.Row style={{
                                                    color: '#0602FF', fontSize: '7vh',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    Incorrect!
                                                </Grid.Row>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    {currentQuestion.options.map((option, index) => (
                                                        index !== correctAnswerIdRender ?
                                                            <Button
                                                                size='large'
                                                                style={{
                                                                    width: '20vw', height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                                    color: 'white', border: '3px #14E399 solid', borderRadius: '50px', background: '#0602FF', padding: '1em 1em'
                                                                }}
                                                            >
                                                                {option}
                                                            </Button>
                                                            :
                                                            <Button
                                                                size='large'
                                                                style={{
                                                                    width: '20vw', height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                                    color: '#0602FF', border: '3px #0602FF solid', borderRadius: '50px', background: 'white', padding: '1em 1em'
                                                                }}
                                                            >
                                                                {option}
                                                            </Button>
                                                    ))}
                                                </Grid.Row>
                                            </>
                            ) : (
                                deviceType === 'phone' ?
                                    !showModal ?
                                        <Grid.Row style={{ margin: 0, padding: 0, height: '66vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Grid.Column textAlign='center'>
                                                <motion.div
                                                    key="input-answer"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: isAnswersLoaded ? 1 : 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    style={{ width: '100%' }}
                                                >
                                                    <textarea
                                                        placeholder='Type your answer here...'
                                                        value={userAnswer}
                                                        onChange={(e) => setUserAnswer(e.target.value)}
                                                        className="styled-input"
                                                        style={{
                                                            marginBottom: '10vh',
                                                            height: '20vh',
                                                            width: '70vw',
                                                            fontSize: '2vh',
                                                            padding: '1em',
                                                            lineHeight: '1.5em',
                                                            textAlign: 'left',
                                                            verticalAlign: 'top',
                                                            resize: 'none'
                                                        }}
                                                    />
                                                    <div></div>
                                                    <button
                                                        className="styled-button"
                                                        onClick={handleSubmitAnswer}
                                                        style={{ height: '7vh', width: '50vw', fontSize: '3vh' }}
                                                    >
                                                        Submit
                                                    </button>
                                                </motion.div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        :
                                        answeredCorrectly ?
                                            <>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '36vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image src={correctAnswerImage} size='small' />
                                                </Grid.Row>
                                                <Grid.Row style={{
                                                    color: '#14E399', fontSize: '7vh',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    Correct!
                                                </Grid.Row>
                                            </>
                                            :
                                            <>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '36vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image src={incorrectAnswerImage} size='small' />
                                                </Grid.Row>
                                                <Grid.Row style={{
                                                    color: '#0602FF', fontSize: '7vh',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    Incorrect!
                                                </Grid.Row>
                                                <Grid.Row style={{
                                                    color: '#14E399', fontSize: '2.5vh', marginTop: '2vh',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    Correct Answer is: {correctAnswerContent}
                                                </Grid.Row>
                                            </>
                                    :
                                    !showModal ?
                                        <Grid.Row style={{ margin: 0, padding: 0, height: '66vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Grid.Column textAlign='center'>
                                                <motion.div
                                                    key="input-answer"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: isAnswersLoaded ? 1 : 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    style={{ width: '100%' }}
                                                >
                                                    <textarea
                                                        placeholder='Type your answer here...'
                                                        value={userAnswer}
                                                        onChange={(e) => setUserAnswer(e.target.value)}
                                                        className="styled-input"
                                                        style={{
                                                            marginBottom: '5vh',
                                                            height: '20vh',
                                                            width: '70vw',
                                                            fontSize: '3vh',
                                                            padding: '1em',
                                                            lineHeight: '1.5em',
                                                            textAlign: 'left',
                                                            verticalAlign: 'top',
                                                            resize: 'none'
                                                        }}
                                                    />
                                                    <div></div>
                                                    <button
                                                        className="styled-button"
                                                        onClick={handleSubmitAnswer}
                                                        style={{ fontSize: '3vh' }}
                                                    >
                                                        Submit
                                                    </button>
                                                </motion.div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        :
                                        answeredCorrectly ?
                                            <>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '36vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image src={correctAnswerImage} size='small' />
                                                </Grid.Row>
                                                <Grid.Row style={{
                                                    color: '#14E399', fontSize: '7vh',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    Correct!
                                                </Grid.Row>
                                            </>
                                            :
                                            <>
                                                <Grid.Row style={{ margin: 0, padding: 0, height: '36vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image src={incorrectAnswerImage} size='small' />
                                                </Grid.Row>
                                                <Grid.Row style={{
                                                    color: '#0602FF', fontSize: '7vh',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    Incorrect!
                                                </Grid.Row>
                                                <Grid.Row style={{
                                                    color: '#14E399', fontSize: '2.5vh', marginTop: '2vh',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    Correct Answer is: {correctAnswerContent}
                                                </Grid.Row>
                                            </>
                            )
                        }
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default Dashboard;
