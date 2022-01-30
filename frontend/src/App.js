import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ActivityScreen from "./screens/ActivityScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ActivityListScreen from "./screens/ActivityListScreen";
import ActivityEditScreen from "./screens/ActivityEditScreen";
import SearchresultsScreen from "./screens/SearchresultsScreen";
import ActivityListMyScreen from "./screens/ActivityListMyScreen";
import ActivityCreateScreen from "./screens/ActivityCreateScreen";



const App = () => {
  return (
    <Router>
      <Route path="/" component={HomeScreen} exact />
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path= "/myactivities" component={ActivityListMyScreen}/>
          <Route path="/create" component={ActivityCreateScreen} />
          <Route path="/activity/:id" component={ActivityScreen} />
          <Route path="/admin/userlist" component={UserListScreen} />
          <Route path="/admin/user/:id/edit" component={UserEditScreen} />
          <Route path="/activitylist" component={ActivityListScreen} exact/>
          <Route path="/activitylist/:pageNumber" component={ActivityListScreen} exact/>
          <Route path="/admin/activity/:id/edit" component={ActivityEditScreen} />
          <Route path="/search/:keyword" component={HomeScreen} exact />
          <Route path="/page/:pageNumber" component={HomeScreen} exact />
          <Route path="/searchresults" component={SearchresultsScreen} exact />
          <Route path="/searchresults/page/:pageNumber" component={SearchresultsScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
