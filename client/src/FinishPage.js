import React, { useState, useEffect } from 'react';
import { Grid, Container, Image, Header } from 'semantic-ui-react';
import './fonts.css'; // Importing the CSS file
import './FinishPage.css'; // Importing the CSS file
import quizlogo from './images/quizlogo.png';
import quizbackground from './images/quizbackground.png';
import finishImage from './images/finish.png'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const FinishPage = () => {
    const [deviceType, setDeviceType] = useState('ipad');
    const navigate = useNavigate();
    const location = useLocation();
    const [quizCode, setQuizCode] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleResize = () => {
        const width = window.innerWidth;
        setDeviceType(width <= 767 ? 'phone' : 'ipad');
    };

    useEffect(() => {
        // Initialize device type on mount
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // Redirect to home page after 7 seconds
        const timer = setTimeout(() => {
            navigate('/');
        }, 7000);

        // Cleanup timer on unmount
        return () => clearTimeout(timer);
    }, [navigate]);

    useEffect(() => {
        const getQuizCode = async () => {
            try {
                const response = await axios.post('http://localhost:5000/quiz-completion', {
                    quizId: 'quiz1',
                    score: location.state?.correctAnswersCount || 0,
                    userId: 'user123' // Replace with actual user ID
                });
                setQuizCode(response.data.code);
            } catch (err) {
                setError('Failed to get code');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        getQuizCode();
    }, [location.state?.correctAnswersCount]);

    return (
        <>
            <Grid style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
                <Grid style={{ height: '14vh', margin: 0, padding: 0 }}>
                    <Grid.Row style={{ margin: 0, padding: 0, background: '#14E399', height: '2vh' }}>

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
                            Question 15 of 15
                        </Grid.Column>
                        <Grid.Column floated='right' textAlign='right' width={8} style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Image src={quizlogo} style={{ width: deviceType === 'ipad' ? '20vw' : '30vw' }} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Grid centered style={{ minHeight: '86vh', width: '100vw', background: '#0602FF', margin: 0, padding: 0, overflowY: 'auto' }}>
                    <Grid.Row style={{ height: '10vh', marginTop: '25vh', padding: 0 }}>
                        <Grid.Column textAlign='center' style={{ color: '#14E399', fontSize: '10vh' }}>
                            Score: {location.state?.correctAnswersCount ? location.state.correctAnswersCount : '0'}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ height: '10vh', margin: 0, paddingBottom: '10vh' }}>
                        <Grid.Column style={{ maxWidth: 450, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Grid.Row style={{ color: 'white', fontSize: deviceType == 'ipad' ? '8vh' : '6vh' }}>
                                Congratulations!
                            </Grid.Row>
                            {isLoading ? (
                                <div style={{ color: 'white', marginTop: '2vh' }}>Loading your code...</div>
                            ) : error ? (
                                <div style={{ color: 'red', marginTop: '2vh' }}>{error}</div>
                            ) : (
                                <div style={{ color: '#14E399', fontSize: '5vh', marginTop: '2vh' }}>
                                    Your Code: {quizCode}
                                </div>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ height: '30vh', margin: 0, padding: 0 }}>
                        <Grid.Column style={{ maxWidth: 450, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src={finishImage} style={{width:'50%'}}/>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Grid>
        </>
    );
};

export default FinishPage;
