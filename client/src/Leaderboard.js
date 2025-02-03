import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Card, Segment, Modal, Button, ModalHeader, Image,
    ModalContent, GridColumn, GridRow
} from 'semantic-ui-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import 'semantic-ui-css/semantic.min.css';
import logo from "./images/quizlogo.png";
import tmpbg from './images/tmpbg.png'
// import "./Leaderboard.css"
import quizbackground from './images/quizbackground.png';


const Leaderboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [deviceType, setDeviceType] = useState('desktop');
    const [topScores, setTopScores] = useState([]);

    const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspectRatio = width / height;

        if (width <= 767) {
            setDeviceType('phone');
        } else if (width > 767 && width <= 1024 && height <= 1366) {
            setDeviceType('iPad');
        }
        // else if (aspectRatio >= 1.77 && aspectRatio <= 1.78) { // 16:9 aspect ratio
        //     setDeviceType('tv');
        // } 
        // else if (width >= 900 && height >= 1600 && height / width >= 1.7) { // Vertical screen detection
        //     setDeviceType('verticalTouchScreen');
        // } else if (height / width >= 1.56) {
        //     setDeviceType('verticalTouchScreen')
        // } 
        else {
            setDeviceType('verticalTouchScreen');
        }
    };


    // const handleResize = () => {
    //     const width = window.innerWidth;
    //     const height = window.innerHeight;

    //     if (width <= 767) {
    //         setDeviceType('phone');
    //     } else if (width > 767 && width <= 1024 && height <= 1366) {
    //         setDeviceType('iPad');
    //     } else {
    //         setDeviceType('desktop');
    //     }
    // };

    // useEffect(() => {
    //     // Initialize device type on mount
    //     handleResize();

    //     // Add event listener for window resize
    //     window.addEventListener('resize', handleResize);

    //     // Cleanup event listener on unmount
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    const fetchTopScores = async () => {
        try {
            const response = await axios.get('https://feduniquiz-69c67d1532fe.herokuapp.com/quizRoutes/topScores');

            setTopScores(response.data);
        } catch (error) {
            console.error('Error fetching top scores:', error);
        }
    };

    useEffect(() => {
        fetchTopScores();

        handleResize();
        window.addEventListener('resize', handleResize);
        // handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderContent = () => {
        switch (deviceType) {
            case 'phone':
                console.log('Rendering phone view');
                return <PhoneView topScores={topScores} />;
            case 'iPad':
                console.log('Rendering iPad view');
                return <IPadView topScores={topScores} />;
            case 'tv':
                console.log('Rendering TV view')
                return <TVView topScores={topScores} />;
            case 'verticalTouchScreen':
                console.log('Rendering vertical touch screen view')
                console.log(window.innerWidth)
                console.log(window.innerHeight)
                console.log(window.innerWidth / window.innerHeight)
                return <VerticalTouchScreenView topScores={topScores} />;
            default:
                console.log('Rendering desktop view')
                return <DesktopView topScores={topScores} />;
        }
    };

    return (
        <>
            {renderContent()}
        </>
    );
};

const getOrdinalSuffix = (i) => {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
};

const getTitleFontSize = (deviceType) => {
    switch (deviceType) {
        case 'phone':
            return '3vh';
        case 'iPad':
            return '4vh';
        case 'tv':
            return '6vh';
        case 'verticalTouchScreen':
            return '4vh';
        default:
            return '6vh';
    }
}

const getFontSize = (deviceType) => {
    switch (deviceType) {
        case 'phone':
            return '2vh';
        case 'iPad':
            return '3vh';
        case 'tv':
            return '5vh';
        case 'verticalTouchScreen':
            return '2.5vh';
        default:
            return '3vh';
    }
};

const PhoneView = ({ topScores }) => {
    const fontSize = getFontSize('phone');
    const titleFontSize = getTitleFontSize('phone');
    return (
        <div className="video-container">
            <div className="content">
                <Container style={{ width: '100vw', height: '100vh' }}>
                    <Segment style={{ height: '100vh', background: '#a7b7c7', padding: 0 }}>
                        <Grid>
                            <Grid.Row columns={4} style={{
                                backgroundImage: `url(${quizbackground})`, backgroundSize: '102% 100%',
                                backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh'
                            }}>
                                <Grid.Column width={1} />
                                <Grid.Column width={8} textAlign='left' style={{ fontSize: titleFontSize }}>
                                    <Image src={logo} style={{ maxWidth: '100%', maxHeight: '8vh', objectFit: 'contain' }} />
                                </Grid.Column>
                                <Grid.Column width={2} />
                                <Grid.Column width={5}>

                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row style={{ height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize }}>
                                    Name
                                </Grid.Column>
                                <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize }}>
                                    Score
                                </Grid.Column>
                            </Grid.Row>
                            {topScores.map((score, index) => (
                                <Grid.Row key={index} style={{ height: '7vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                    <Grid.Column width={8} textAlign='center' style={{ fontSize }}>
                                        {score.firstName}
                                    </Grid.Column>
                                    <Grid.Column width={8} textAlign='center' style={{ fontSize }}>
                                        {score.score}
                                    </Grid.Column>
                                </Grid.Row>
                            ))}
                        </Grid>
                    </Segment>
                </Container>
            </div>
        </div>
    );
};

const IPadView = ({ topScores }) => {
    const fontSize = getFontSize('iPad');
    const titleFontSize = getTitleFontSize('iPad')
    return (
        <div className="video-container">
            <div className="content">
                <Container style={{ width: '100vw', height: '100vh' }}>
                    <Segment style={{ height: '100vh', background: '#a7b7c7', padding: 0 }}>
                        <Grid>
                            <Grid.Row columns={4} style={{
                                backgroundImage: `url(${quizbackground})`, backgroundSize: '102% 100%',
                                backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh'
                            }}>
                                <Grid.Column width={1} />
                                <Grid.Column width={8} textAlign='left' style={{ fontSize: titleFontSize }}>
                                    <Image src={logo} style={{ maxWidth: '100%', maxHeight: '8vh', objectFit: 'contain' }} />
                                </Grid.Column>
                                <Grid.Column width={2} />
                                <Grid.Column width={5}>

                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row style={{ height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize }}>
                                    Name
                                </Grid.Column>
                                <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize }}>
                                    Score
                                </Grid.Column>
                            </Grid.Row>
                            {topScores.map((score, index) => (
                                <Grid.Row key={index} style={{ height: '7vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                    <Grid.Column width={8} textAlign='center' style={{ fontSize }}>
                                        {score.firstName}
                                    </Grid.Column>
                                    <Grid.Column width={8} textAlign='center' style={{ fontSize }}>
                                        {score.score}
                                    </Grid.Column>
                                </Grid.Row>
                            ))}
                        </Grid>
                    </Segment>
                </Container>
            </div>
        </div>
    );
};

const TVView = ({ topScores }) => {
    const fontSize = getFontSize('tv');
    const titleFontSize = getTitleFontSize('tv')
    return (
        <div className="video-container">
            <div className="content">
                <Container style={{ width: '100vw', height: '100vh' }}>
                    <Segment style={{ height: '100vh', background: '#a7b7c7', padding: 0 }}>
                        <Grid>
                            <Grid.Row columns={4} style={{
                                backgroundImage: `url(${quizbackground})`, backgroundSize: '102% 100%',
                                backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh'
                            }}>
                                <Grid.Column width={1} />
                                <Grid.Column width={8} textAlign='left' style={{ fontSize: titleFontSize }}>
                                    <Image src={logo} style={{ maxWidth: '100%', maxHeight: '8vh', objectFit: 'contain' }} />
                                </Grid.Column>
                                <Grid.Column width={2} />
                                <Grid.Column width={5}>

                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row style={{ height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize }}>
                                    Name
                                </Grid.Column>
                                <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize }}>
                                    Score
                                </Grid.Column>
                            </Grid.Row>
                            {topScores.map((score, index) => (
                                <Grid.Row key={index} style={{ height: '7vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                    <Grid.Column width={8} textAlign='center' style={{ fontSize }}>
                                        {score.firstName}
                                    </Grid.Column>
                                    <Grid.Column width={8} textAlign='center' style={{ fontSize }}>
                                        {score.score}
                                    </Grid.Column>
                                </Grid.Row>
                            ))}
                        </Grid>
                    </Segment>
                </Container>
            </div>
        </div>
    );
};

const VerticalTouchScreenView = ({ topScores }) => {
    const fontSize = getFontSize('verticalTouchScreen');
    const titleFontSize = getTitleFontSize('verticalTouchScreen');
    return (
        <div className="video-container">
            <div className="content" >
                <Container style={{ width: '100vw', height: '100vh', background: '#9ECFFF' }}>
                    <Segment style={{ background: '#9ECFFF', padding: 0 }}>
                        <Grid>
                            <Grid.Row columns={4} style={{
                                backgroundImage: `url(${quizbackground})`, backgroundSize: '102% 100%',
                                backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh'
                            }}>
                                <Grid.Column width={1} />
                                <Grid.Column width={8} textAlign='left' style={{ fontSize: titleFontSize }}>
                                    <Image src={logo} style={{ maxWidth: '100%', maxHeight: '8vh', objectFit: 'contain' }} />
                                </Grid.Column>
                                <Grid.Column width={2} />
                                <Grid.Column width={5}>

                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row style={{ height: '5vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize }}>
                                    Name
                                </Grid.Column>
                                <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize }}>
                                    Score
                                </Grid.Column>
                            </Grid.Row>
                            {/* <Segment style={{ height: '85vh',padding:0,width:'100%' }}> */}
                                {topScores.map((score, index) => (
                                    <Grid.Row key={index} style={{
                                        height: '9.44vh',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        background: index % 2 == 0 ? '#B9EAD6' : '#ffffff'
                                    }}>
                                        <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize, margin: 0, padding: 0 }}>
                                            {score.firstName}
                                        </Grid.Column>
                                        <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize, margin: 0, padding: 0 }}>
                                            {score.score}
                                        </Grid.Column>

                                    </Grid.Row>
                                ))}
                            {/* </Segment> */}

                        </Grid>
                    </Segment>
                </Container>
            </div>
        </div>
    );
};


const DesktopView = ({ topScores }) => {
    const fontSize = getFontSize('desktop');
    const titleFontSize = getTitleFontSize('desktop')
    return (
        <div className="video-container">
            <div className="content">
                <Container style={{ width: '100vw', height: '100vh' }}>
                    <Segment style={{ height: '100vh', background: '#a7b7c7', padding: 0 }}>
                        <Grid>
                            <Grid.Row columns={4} style={{
                                backgroundImage: `url(${quizbackground})`, backgroundSize: '102% 100%',
                                backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh'
                            }}>
                                <Grid.Column width={1} />
                                <Grid.Column width={8} textAlign='left' style={{ fontSize: titleFontSize }}>
                                    <Image src={logo} style={{ maxWidth: '100%', maxHeight: '8vh', objectFit: 'contain' }} />
                                </Grid.Column>
                                <Grid.Column width={2} />
                                <Grid.Column width={5}>

                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row style={{ height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize }}>
                                    Name
                                </Grid.Column>
                                <Grid.Column width={8} textAlign='center' style={{ fontSize: fontSize }}>
                                    Score
                                </Grid.Column>
                            </Grid.Row>
                            {topScores.map((score, index) => (
                                <Grid.Row key={index} style={{ height: '7vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Grid.Column width={8} textAlign='center' style={{ fontSize }}>
                                        {score.firstName}
                                    </Grid.Column>
                                    <Grid.Column width={8} textAlign='center' style={{ fontSize }}>
                                        {score.score}
                                    </Grid.Column>
                                </Grid.Row>
                            ))}
                        </Grid>
                    </Segment>
                </Container>
            </div>
        </div>
    );
};

export default Leaderboard;
