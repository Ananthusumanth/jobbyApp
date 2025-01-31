import {Switch, Route, Redirect} from 'react-router-dom'
import HomeRoute from './components/HomeRoute'
import LoginRoute from './components/LoginRoute'
import JobsRoute from './components/JobsRoute'
import JobItemDetailsRoute from './components/JobItemDetailsRoute'
import ProtectedRouter from './components/ProtectedRouter'
import NotFoundRoute from './components/NotFoundRoute'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginRoute} />
    <ProtectedRouter exact path="/" component={HomeRoute} />
    <ProtectedRouter exact path="/jobs" component={JobsRoute} />
    <ProtectedRouter exact path="/jobs/:id" component={JobItemDetailsRoute} />
    <Route exact path="/not-found" component={NotFoundRoute} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
