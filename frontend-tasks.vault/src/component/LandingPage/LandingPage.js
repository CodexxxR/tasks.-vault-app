import "./LandingPage.css";
import {React, useState, useEffect } from "react";
import { Link,useNavigate} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import {AiOutlineLinkedin, AiOutlineGithub, AiOutlineMail} from "react-icons/ai";
import { HashLink } from "react-router-hash-link";
import LoginPage from "./LoginPage";
import Loader from "../Loader/Loader";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseConfig from "../../firebaseConfig";

function HeroSection({ showAboutUs, showFeatures }) {
    return (
        <div className="hero-section" id="hero-section">
            <div className="app-name" id="hero-section">
                <h1>Tasks.<br />vault</h1>
            </div>
            <div className="app-description">
                <p>Tasks.vault is a simple and efficient task management application that helps users organize their 
                    daily tasks, prioritize them, and keep track of their progress. With an intuitive user interface and 
                    a range of useful features, the app aims to enhance productivity and ensure that users stay on top of 
                    their responsibilities.</p>
            </div>
            <div className="buttons-section">
                <button className="app-aboutus" onClick={showAboutUs}>About Us</button>
                <button className="app-knowmore" onClick={showFeatures}>Explore Features</button>
            </div>
        </div>
    );
}

function AboutUsSection({ backHome }) {
    return (
        <div className="aboutus-section" id="aboutus-section">
            <div className="aboutus-section" id="aboutus-section">
                <h2>About-Us</h2>
                <div className="aboutme">
                    <div className="my-image">photo</div>
                    <div className="my-links">
                        <ul>
                            <li><AiOutlineLinkedin size={25}/><a href="https://www.linkedin.com/in/robin-paul-820b2b217/" target="_blank">linkedin.com/in/robin-paul</a></li>
                            <li><AiOutlineGithub size={25}/><a href="https://github.com/CodexxxR" target="_blank">https://github.com/CodexxxR</a></li>
                            <li><AiOutlineMail size={25}/><a href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=paul.robin9024@gmail.com" target="_blank">paul.robin9024@gmail.com</a></li>

                        </ul>
                    </div>
                </div>
                <div className="aboutme-description">
                        <h3>Robin Paul</h3><br></br>
                        B. Tech, Electrical Engineering<br></br>
                        National Institute of Technology, Silchar
                </div>
            </div>
            <div className="button-section">
                <button className="pro-section-link" onClick={backHome}>Back Home</button>
            </div>
        </div>
    );
}

function FeaturesSection({ backHome }) {
    return (
        <div className="features-section" id="features-section">
            <div className="features-section" id="features-section">
                <h2>Features</h2>
                <ul>
                    <li>Task Creation and Editing </li>

                    <li>Task Priority and Percentage Completion</li>

                    <li>Due Date Management</li>

                    <li>Labeling and Categorization</li>

                    <li>Task Favourites</li>

                    <li>User-Friendly Carousel Interface</li>

                    <li>Landing Page</li>
                </ul> 
            </div>
            <div className="button-section">
                <button className="pro-section-link" onClick={backHome}>Back Home</button>
            </div>
        </div>
           
    );
}

firebase.initializeApp(firebaseConfig);

const LandingPage = () => {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [registrationError, setRegistrationError] = useState(null);
    const [section, setSection] = useState('hero');
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = response.user;
            user.updateProfile({
                displayName: name // Set the display name here
              });
            await user.sendEmailVerification();
            
            setRegistrationError(null);
        } catch (error) {
            setRegistrationError(error.message);
        }
        setLoginModalOpen(true);
        console.log(registrationError);
    };

    const handleGoogleLogin = async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);
            const user = firebase.auth().currentUser;
            const token = await user.getIdToken();
            const displayName = user.providerData[0]?.displayName || 'User'; 
            await user.updateProfile({
                displayName: displayName
            });

            localStorage.setItem('authToken', token);
            navigate('/home'); 
        } catch (error) {
          setRegistrationError(error.message);
        }
      };

    

    const handleLoginModalOpen = () => {
        setLoginModalOpen(true);
    };

    const handleLoginModalClose = () => {
        setLoginModalOpen(false);
    };

    useEffect(() => {
        setTimeout(() => {
        setLoading(false);
        }, 2000);
    }, []);

    if (isLoading) {
        return <Loader />;
    }
     // Initial section is 'hero'

    const showAboutUs = () => {
        setSection('aboutus');
    };

    const showFeatures = () => {
        setSection('features');
    };

    const backHome = () => {
        setSection('hero');
    };

    return ( 
        <div className="landing-page-bg">
            <div className="main-landing-page">
                <div className="main-landing-page">
                    {section === 'hero' && <HeroSection showAboutUs={showAboutUs} showFeatures={showFeatures} />}
                    {section === 'aboutus' && <AboutUsSection backHome={backHome} />}
                    {section === 'features' && <FeaturesSection backHome={backHome} />}
                </div>
                <div className="signup-section" id="signup-section">
                    <h2>Create your account</h2>
                    <h4>Let's get started!</h4>
                    <div className="google-login">
                        <FcGoogle size={25} className="google-logo"/>
                        <Link onClick={handleGoogleLogin}>Login with Google</Link>
                    </div>
                    <div className="divison">
                        <hr></hr>
                        <h5>or</h5>
                        <hr></hr>
                    </div>
                    <div className="signup-form">
                        <form onSubmit={handleSubmit}>
                            <label>Name</label>
                            <input className="signup-form-name" type="text" name="name" placeholder="Enter your Name" required></input>
                            <label>Email</label>
                            <input className="signup-form-email" type="email" name="email" placeholder="Enter your Email" required></input>
                            <label>Password</label>
                            <input className="signup-form-password" type="password" name="password" placeholder="Enter your password" required></input>
                            <div className="signup-form-terms">
                                <input className="signup-form-checkbox" type="checkbox" required></input>
                                <p>I agree to all the terms and conditions*</p>
                            </div>
                            <button type="submit">Sign up</button>
                        </form>
                        <div className="login-section">
                            <p>Already have an account? <button className="login-button" onClick={handleLoginModalOpen}>Log in</button></p>
                        </div>
                    
                    </div>
                </div>
            </div>
            {isLoginModalOpen && (
                <LoginPage handleLoginModalClose={handleLoginModalClose} />
            )}
            
        </div>
     );
}
 
export default LandingPage;