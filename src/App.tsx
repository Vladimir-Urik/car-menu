import "./App.css";
import {RecoilRoot} from "recoil";
import {MainScreen} from "./components/MainScreen.tsx";
import {DarkModeController} from "./components/Controllers/DarkModeController.tsx";
import {PublicSecurityController} from "./components/Controllers/PublicSecurityController.tsx";

function App() {
  return (
      <RecoilRoot>
          <DarkModeController>
              <PublicSecurityController>
                  <MainScreen />
              </PublicSecurityController>
          </DarkModeController>
      </RecoilRoot>
  );
}

export default App;
