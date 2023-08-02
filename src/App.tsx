import './App.css'

import Main from "./pages/main";
import { Provider } from "react-redux";
import store from "./store";

const App = () => {

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  )
}

export default App
