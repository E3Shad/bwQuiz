import React, { useState, useEffect } from 'react';
import { Grid, Container, Image, Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import './fonts.css'; // Importing the CSS file
import './WelcomePage.css'; // Importing the CSS file
import background from './images/generalbackground.png';
import logo from './images/quizlogo.png';

const WelcomePage = () => {
    const [deviceType, setDeviceType] = useState('ipad');

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/dashboard');
    };

    const handleResize = () => {
        const width = window.innerWidth;
        if (width <= 767) {
            setDeviceType('phone');
        } else {
            setDeviceType('ipad');
        }
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

    return (
        <Container
            className="welcome-container"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: deviceType === 'phone' ? '100% 100%' : '105% 105%',
                backgroundPosition: 'center'
            }}
        >
            <Grid centered verticalAlign='middle' className="grid">
                <Grid.Row className="top-row">
                    <Grid.Column textAlign='center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            src={logo}
                            style={{
                                width: deviceType === 'ipad' ? '50vw' : '80vw'
                            }}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="center-row">
                    <Grid.Column textAlign='center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            onClick={handleClick}
                            style={{
                                background: '#0602FF',
                                border: '5px solid #14E399',
                                borderRadius: '70px',
                                color: 'white',
                                width: deviceType === 'ipad' ? '70vw' : '85vw',
                                height: deviceType === 'ipad' ? '14vh' : '9.1vh',
                                fontSize: deviceType === 'ipad' ? '7vw' : '8vw',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            TAP TO START
                        </Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="bottom-row">
                    <Grid.Column>
                        <div className="cityscape"></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default WelcomePage;
