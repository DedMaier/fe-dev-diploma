import { useDispatch, useSelector } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { MainPage } from 'components/MainPage';
import { SuccessPage } from 'components/SuccessPage';
import { OrderPage } from 'components/OrderPage';
import { Footer } from 'components/Footer';
import { Modal } from 'components/Modal';

import { hideModal } from 'reducers/app';

export const App = () => {
  const dispatch = useDispatch();
  const { modal } = useSelector((state) => state.app);

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route path="/success" component={SuccessPage} />
          <Route component={OrderPage} />
        </Switch>
      </Router>
      <Footer />
      <Modal onClose={() => dispatch(hideModal())} {...modal} />
    </>
  );
};
