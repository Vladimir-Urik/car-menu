import "./App.css";
import {RecoilRoot} from "recoil";
import {MainScreen} from "./components/MainScreen.tsx";

function App() {
  return (
      <RecoilRoot>
          <MainScreen />
      </RecoilRoot>
  );
}

export default App;
