import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./i18n";
import AntThemeProvider from "./common/ant/AntThemeProvider";

function App() {
  return (
    <Provider store={store}>
      <AntThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AntThemeProvider>
    </Provider>
  );
}

export default App;
