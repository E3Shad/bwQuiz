import React, { useState, useEffect } from 'react';
import { Grid, Form, Button, Header, Image } from 'semantic-ui-react';
import cryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import './fonts.css'; // Importing the CSS file
import './Register.css'; // Importing the CSS file
import quizlogo from './images/quizlogo.png';
import quizbackground from './images/quizbackground.png';

const Register = () => {
    const [deviceType, setDeviceType] = useState('ipad');
    const navigate = useNavigate();
    const location = useLocation();

    const [firstName, setFirstName] = useState('');
    // const [lastName, setLastName] = useState('');
    // const [email, setEmail] = useState('');
    // const [phoneNumber, setPhoneNumber] = useState('');


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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Generate a random key for encryption
        const key = cryptoJS.lib.WordArray.random(16).toString();

        // Encrypt the input fields
        const firstNameCiphertext = cryptoJS.AES.encrypt(firstName, key).toString();
        // const lastNameCiphertext = cryptoJS.AES.encrypt(lastName, key).toString();
        // const emailCiphertext = cryptoJS.AES.encrypt(email, key).toString();
        // const phoneNumberCiphertext = cryptoJS.AES.encrypt(phoneNumber, key).toString();

        // Ensure correctAnswersCount is a string before encrypting
        const correctAnswersCount = location.state?.correctAnswersCount ? location.state.correctAnswersCount.toString() : '0';
        // console.log("correctAnswersCount:", correctAnswersCount);

        const scoreCiphertext = cryptoJS.AES.encrypt(correctAnswersCount, key).toString();

        const payload = {
            params: {
                firstNameCiphertext,
                // lastNameCiphertext,
                // emailCiphertext,
                // phoneNumberCiphertext,
                key,
                scoreCiphertext
            }
        };


        try {
            const response = await fetch('/quizRoutes/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok || response.status === 304) {
                const result = await response.json();

                if (result.insertedId) {
                    // Show success alert
                    Swal.fire({
                        title: 'Thank you for participating!',
                        text: 'Click the button to continue.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        allowOutsideClick: false, // Prevent closing by clicking outside
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // navigate('/register', { state: { correctAnswersCount } });

                            navigate('/finish',{ state:{ correctAnswersCount: location.state.correctAnswersCount}}); // Navigate to home on button click
                        } else {
                            navigate('/finish',{ state:{ correctAnswersCount: location.state.correctAnswersCount}}); // Navigate to home on button click
                        }
                    });
                } else {
                    throw new Error('Registration failed. No ID returned.');
                }
            } else {
                const error = await response.text();
                console.error('Registration failed:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Registration failed. Please check the input and try again. Notice that for name input only a-z,A-Z,0-9 and symbols below are allowed: spaces "\," "\." "\&","-" ',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Error submitting form. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

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


                <Grid centered style={{ height: '86vh', width: '100vw', background: 'white', margin: 0, padding: 0, overflowY: 'auto' }}>
                    <Grid.Row style={{ height: '10vh', marginTop: '20vh', padding: 0 }}>
                        <Grid.Column textAlign='center'>
                            {/* <Header as='h1' style={{ color: 'white', fontSize: '3vh' }}>TO ENTER AND WIN</Header>
                        <Header as='h1' style={{ color: 'white', fontSize: '7vh' }}>PRIZE</Header>
                        <Header as='h2' style={{ color: 'white', fontSize: '3vh' }}>ENTER YOUR DETAILS BELOW.</Header> */}
                            <Header as='h1' style={{ color: '#0602FF', fontSize:deviceType=='ipad'? '5vh' :'4vh' }}>Enter detail text</Header>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row style={{ height: '10vh', margin: 0, padding: 0 }}>
                        <Grid.Column style={{ maxWidth: 450, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Grid.Row>
                                <textarea
                                    placeholder='Name'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="styled-input"
                                    style={{
                                        marginBottom: '1vh',
                                        height: '7vh',
                                        width: deviceType == 'ipad' ? '60vw' : '80vw',
                                        fontSize: '3vh',
                                        padding: '1.7vh',
                                        lineHeight: '1em',
                                        textAlign: 'left',
                                        verticalAlign: 'top',
                                        resize: 'none'
                                    }}
                                />
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                    {/* <Grid.Row style={{ height: '10vh', margin: 0, padding: 0 }}>
                        <Grid.Column style={{ maxWidth: 450, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Grid.Row>
                                <textarea
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="styled-input"
                                    style={{
                                        height: '7vh',
                                        width: deviceType == 'ipad' ? '60vw' : '80vw',
                                        fontSize: '3vh',
                                        padding: '1.7vh',
                                        lineHeight: '1em',
                                        textAlign: 'left',
                                        verticalAlign: 'top',
                                        resize: 'none'
                                    }}
                                />
                            </Grid.Row>

                        </Grid.Column>
                    </Grid.Row> */}

                    <Grid.Row style={{ height: '20vh', margin: 0, padding: 0 }}>
                        <Grid.Column style={{ maxWidth: 450, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <button 
                                onClick={handleSubmit}
                                className="styled-button"

                                style={{
                                    height: '7vh', width: deviceType == 'ipad' ? '20vw' : '50vw', fontSize: '3vh',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}
                            >
                                Submit
                            </button>
                        </Grid.Column>
                    </Grid.Row>

                    {/* <Form onSubmit={handleSubmit}>
                                
                                <Form.Input
                                    // label="Name"
                                    placeholder="Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    style={{ marginBottom: '1vh', width: deviceType == 'ipad' ? '40vw' : '80vw' }}
                                    required
                                />

                                <Form.Input
                                    // label="Email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ marginBottom: '4vh', width: deviceType == 'ipad' ? '40vw' : '80vw' }}
                                    required
                                />


                                <button type="submit"
                                    className="styled-button"

                                    style={{
                                        height: '7vh', width: deviceType == 'ipad' ? '20vw' : '50vw', fontSize: '3vh',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}
                                >
                                    Submit
                                </button>
                            </Form> */}
                    {/* </Grid.Column>
            </Grid.Row> */}
                </Grid >
            </Grid >
        </>
    );
};

export default Register;
