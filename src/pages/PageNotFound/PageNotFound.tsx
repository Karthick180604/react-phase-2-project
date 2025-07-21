import React from "react";
import "./PageNotFound.css";

import PageNotFoundImage from "../../assets/PageNotFoundImage.png";

interface NotFoundPageProps {}

const PageNotFound: React.FC<NotFoundPageProps> = () => {
  return (
    <div className="not-found-container">
      <img
        src={PageNotFoundImage}
        alt="Company Logo"
        className="not-found-logo"
      />
      <h1>Page Not Found</h1>
      <p>We're sorry, the page you requested could not be found.</p>
      <p>
        <a href="/">Go back to Homepage</a>
      </p>
    </div>
  );
};

export default PageNotFound;
