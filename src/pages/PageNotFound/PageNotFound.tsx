import React from "react";
import "./PageNotFound.css";
import PageNotFoundImage from "../../assets/PageNotFoundImage.png";
import { Link } from "react-router-dom";

const PageNotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <img src={PageNotFoundImage} alt="Not Found" className="not-found-logo" />
      <h1>Page Not Found</h1>
      <p>We're sorry, the page you requested could not be found.</p>
      <p>
        <Link to="/home" className="not-found-link">
          Go back to Homepage
        </Link>
      </p>
    </div>
  );
};

export default PageNotFound;
