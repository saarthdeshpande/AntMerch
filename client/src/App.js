import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.component";
import ProductPage from './pages/ProductPage/ProductPage'
import OrderPage from './pages/OrderPage/OrderPage'

import './App.css';
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path={'/'} component={ProductPage} />
          <PrivateRoute exact path={'/orders'} component={OrderPage} />
        </Switch>
      </BrowserRouter>
  );
}

export default App;
