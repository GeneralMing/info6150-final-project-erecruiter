import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import headerLogo from "../../assets/e - Recruiter new teal.svg";
import { BsPersonCircle } from "react-icons/bs";
import "./Layout.css";

const Layout = () => {
    const [activeButton, setActiveButton] = useState("home"); // Default to "Home"
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();
    const location = useLocation(); // Get current location

    useEffect(() => {
        // Retrieve user details from localStorage
        const userDetails = JSON.parse(localStorage.getItem("userDetails"));
        if (userDetails) {
            setUserDetails(userDetails);
        }

        // Set the active button based on current location on first load
        if (location.pathname.includes("jobdescription")) {
            setActiveButton("job-descriptions");
        } else if (location.pathname.includes("candidate")) {
            setActiveButton("candidates");
        } else if (location.pathname.includes("userlist")) {
            setActiveButton("user-list"); // Set active for user list
        } else if (location.pathname.includes("profile")) {
            setActiveButton("profile");
        } else {
            setActiveButton("home");
        }
    }, [location]);

    const handleButtonClick = (buttonId, path) => {
        setActiveButton(buttonId);
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove the token from local storage
        localStorage.removeItem("userDetails"); // Remove the user details from local storage
        navigate("/", { replace: true }); // Redirect to the login page
    };

    const renderMenu = () => {
        if (userDetails.role === "admin") {
            return (
                <>
                    <Nav.Link
                        as="button"
                        className={`button ${activeButton === "home" ? "active-button" : ""}`}
                        onClick={() => handleButtonClick("home", "/layout")}
                    >
                        Home
                    </Nav.Link>
                    <Nav.Link
                        as="button"
                        className={`button ${activeButton === "job-descriptions" ? "active-button" : ""}`}
                        onClick={() => handleButtonClick("job-descriptions", "/layout/jobdescription")}
                    >
                        Job Posting
                    </Nav.Link>
                    <Nav.Link
                        as="button"
                        className={`button ${activeButton === "candidates" ? "active-button" : ""}`}
                        onClick={() => handleButtonClick("candidates", "/layout/candidate")}
                    >
                        Candidates
                    </Nav.Link>
                    <Nav.Link
                        as="button"
                        className={`button ${activeButton === "user-list" ? "active-button" : ""}`}
                        onClick={() => handleButtonClick("user-list", "/layout/userlist")}
                    >
                        User List
                    </Nav.Link>
                </>
            );
        } else if (userDetails.role === "employee") {
            return (
                <>
                    <Nav.Link
                        as="button"
                        className={`button ${activeButton === "home" ? "active-button" : ""}`}
                        onClick={() => handleButtonClick("home", "/layout")}
                    >
                        Home
                    </Nav.Link>
                    <Nav.Link
                        as="button"
                        className={`button ${activeButton === "job-descriptions" ? "active-button" : ""}`}
                        onClick={() => handleButtonClick("job-descriptions", "/layout/jobdescription")}
                    >
                        Job Posting
                    </Nav.Link>
                    <Nav.Link
                        as="button"
                        className={`button ${activeButton === "candidates" ? "active-button" : ""}`}
                        onClick={() => handleButtonClick("candidates", "/layout/candidate")}
                    >
                        Candidates
                    </Nav.Link>
                </>
            );
        } else if (userDetails.role === "candidate") {
            return (
                <>
                    <Nav.Link
                        as="button"
                        className={`button ${activeButton === "job-descriptions" ? "active-button" : ""}`}
                        onClick={() => handleButtonClick("job-descriptions", "/layout/jobdescription")}
                    >
                        Job Posting
                    </Nav.Link>
                </>
            );
        } else {
            return null; // No menu for unknown roles
        }
    };

    const userProfileMenu = (
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate("/layout/profile")}>Profile</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
    );

    return (
        <div>
            <header className="header">
                <Navbar bg="light" expand="lg" fixed="top" className="shadow-lg p-3 custom-navbar">
                    <Container fluid>
                        <Navbar.Brand onClick={() => navigate("/layout")}>
                            <img src={headerLogo} alt="Logo" width="120" className="d-inline-block align-top" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbar-nav" />
                        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
                            <Nav className="ms-auto nav-links">{renderMenu()}</Nav>
                            <div className="user-details d-flex align-items-center me-3">
                                <span className="username">
                                    {userDetails.fullName}
                                </span>
                                <span className="role ms-2">
                                    ({userDetails.role})
                                </span>
                            </div>
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" id="user-profile-dropdown" className="no-caret">
                                    <BsPersonCircle size={30} />
                                </Dropdown.Toggle>
                                {userProfileMenu}
                            </Dropdown>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            <div className="content"> {/* Ensures main content has space for fixed navbar */}
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
