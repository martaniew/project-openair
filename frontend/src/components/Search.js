import React, { useState } from "react";
import { Form, Button, Container, InputGroup } from "react-bootstrap";
import FormContainer from "./FormContainer";

const Search = ({ history }) => {
  // state variables
  const [adress, setAdress] = useState("");
  const [discipline, setDiscipline] = useState("");

  // redirect to searchreasult screen with search parameters  when search button is pushed
  const submitHandler = (e) => {
    e.preventDefault();
    history.push(`/searchresults?adress=${adress}&discipline=${discipline}`);
  };

  return (
    <form onSubmit={submitHandler} className="searchform">
      <input
        className="firstsearchdinput"
        type="text"
        name="q"
        onChange={(e) => setAdress(e.target.value)}
        placeholder="Saisir un lieu, un code postal, une ville...."
      />

      <div className="vl"></div>

      <input
        className="seconsearchdinput"
        type="text"
        name="q"
        onChange={(e) => setDiscipline(e.target.value)}
        placeholder="Saisir une discipline, une activité extérieure..."
      />

      <button type="submit" className="searchbutton">
        Rechercher
      </button>
    </form>
  );
};

export default Search;
