import React from "react";
import { Helmet } from "react-helmet";

// Meta tags for Google search

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome To UrbanSport",
  description: "Find an activity near you",
  keywords: "sport, yoga, running, gym, dance",
};

export default Meta;
